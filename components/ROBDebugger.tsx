import React, { useState } from "react";
import * as Utils from "@/lib/utils";
import * as Constants from "@/lib/constants";
import * as Types from "@/lib/types";

type SignalType = {
  sigType: string;
  width: number;
};

type SignalData = {
  name: string;
  type: SignalType;
  value: string;
};

type ScopeData = {
  [key: string]: SignalData | { children: ScopeData };
};

type ROBDebuggerProps = {
  className: string;
  signalData: ScopeData;
};

const parseROBData = (entries: string, arrLen: number): Types.ROB_DATA[] => {
  // Remove the 'b' prefix if present
  const binaryStr = entries.startsWith("b") ? entries.slice(1) : entries;

  const result: Types.ROB_DATA[] = [];
  const entryWidth = Types.ROB_DATA_WIDTH;

  // Helper function to extract bits and convert to number
  const extractBits = (startIndex: number, length: number): number => {
    const bitsSlice = binaryStr.slice(startIndex, startIndex + length);
    return parseInt(bitsSlice, 2);
  };

  // Process each ROB entry from the end to the beginning
  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;

    // Extract fields from left to right in the entry
    const T_old = extractBits(startIdx, Types.PHYS_REG_TAG_WIDTH);

    const T_new = extractBits(
      startIdx + Types.PHYS_REG_TAG_WIDTH,
      Types.PHYS_REG_TAG_WIDTH
    );

    const R_dest = extractBits(
      startIdx + 2 * Types.PHYS_REG_TAG_WIDTH,
      Types.REG_IDX_WIDTH
    );

    const valid =
      binaryStr[
        startIdx + 2 * Types.PHYS_REG_TAG_WIDTH + Types.REG_IDX_WIDTH
      ] === "1";

    const retireable =
      binaryStr[
        startIdx + 2 * Types.PHYS_REG_TAG_WIDTH + Types.REG_IDX_WIDTH + 1
      ] === "1";

    result.push({
      T_old,
      T_new,
      R_dest,
      valid,
      retireable,
    });
  }

  return result;
};

const DisplayROBData = (
  ROBData: Types.ROB_DATA[],
  head: number,
  tail: number,
  isROB: boolean
) => {
  return (
    <>
      <table className="">
        <thead className="border-b">
          <tr>
            <th className=" p-2">Entry #</th>
            <th className=" border-l p-2">R_dest</th>
            <th className=" border-l p-2">T_new</th>
            <th className=" border-l p-2">T_old</th>
            <th className=" border-l p-2">Valid</th>
            {isROB && (
              <>
                <th className=" border-l p-2">Retirable</th>
                <th className=" border-l p-2 pl-9">Head/Tail</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {ROBData.map((entry, idx) => {
            let isHead = head === idx;
            let isTail = tail === idx;

            if (!isROB) {
              isHead = false;
              isTail = false;
            }

            const isBoth = isHead && isTail;
            const isEither = isHead || isTail;

            const entryNumber = idx.toString().padStart(2, "") + ":";

            // Helper function to display the value or "NaN"
            const displayValue = (value: any) => (isNaN(value) ? "XX" : value);

            // green if tail, red if head, yellow if both
            const color = isBoth
              ? "bg-yellow-200"
              : isHead
              ? "bg-red-200"
              : isTail
              ? "bg-green-200"
              : "";
            const headOrTailString =
              "←" +
              (isBoth
                ? " Head/Tail"
                : isHead
                ? " Head"
                : isTail
                ? " Tail"
                : "");

            return (
              <tr key={idx} className={"border-b " + color}>
                <td className="text-right">{entryNumber}</td>
                <td className="text-center border-l">
                  {"r" + displayValue(entry.R_dest)}
                </td>
                <td className="text-center border-l">
                  {"p" + displayValue(entry.T_new)}
                </td>
                <td className="text-center border-l">
                  {"p" + displayValue(entry.T_old)}
                </td>
                <td className="text-center border-l">
                  {displayValue(entry.valid ? "1" : "0")}
                </td>
                {isROB && (
                  <>
                    <td className="text-center border-l">
                      {displayValue(entry.retireable ? "1" : "0")}
                    </td>
                    <td className="text-center border-l pl-3">
                      {isEither && headOrTailString}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

// function to extract values from the signal data
const extractSignalValue = (
  signalData: ScopeData,
  name: string
): SignalData => {
  return (signalData as unknown as { children: ScopeData }).children[
    name
  ] as SignalData;
};

const extractSignalValueToInt = (
  signalData: ScopeData,
  name: string
): number => {
  let signalValue = (
    (signalData as unknown as { children: ScopeData }).children[
      name
    ] as SignalData
  ).value;

  return signalValue.startsWith("b")
    ? Utils.binaryStringToInt(signalValue)
    : parseInt(signalValue);
};

const ROBDebugger: React.FC<ROBDebuggerProps> = ({ className, signalData }) => {
  // input signals
  const dispatched_ins = extractSignalValue(signalData, "dispatched_ins").value;
  const ROB_dispatched_ins = parseROBData(dispatched_ins, Constants.N);

  // internal signals
  const reset = extractSignalValueToInt(signalData, "reset");
  const head = extractSignalValueToInt(signalData, "head");
  const tail = extractSignalValueToInt(signalData, "tail");
  const available_spots = extractSignalValueToInt(
    signalData,
    "available_spots"
  );
  // pure internal signals
  const head_growth = extractSignalValueToInt(signalData, "head_growth");
  const tail_growth = extractSignalValueToInt(signalData, "tail_growth");
  const next_direction = extractSignalValueToInt(signalData, "next_direction");
  const last_direction = extractSignalValueToInt(signalData, "last_direction");
  const empty = extractSignalValueToInt(signalData, "empty");
  const retireable_cnt = extractSignalValueToInt(signalData, "retireable_cnt");

  // entries
  const entries = extractSignalValue(signalData, "entries").value;
  const ROB_entries = parseROBData(entries, Constants.ROB_SZ);

  // output signals
  const open_spots = extractSignalValueToInt(signalData, "open_spots");

  return (
    <>
      <div className={`${className}`}>
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 inline-flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4  ">
            ROB (size = {Constants.ROB_SZ})
          </h2>
          {/* display inputs */}
          {DisplayROBData(ROB_dispatched_ins, -1, -1, false)}

          {/* display ROB internals */}
          <div className="flex space-x-4 mt-4">
            <p className="mb-4">
              <span className="font-bold">Available Spots:</span>{" "}
              {available_spots}
            </p>
            <p className="mb-4">
              <span className="font-bold">Retireable Count:</span>{" "}
              {retireable_cnt}
            </p>
            <p className="mb-4">
              <span className="font-bold">Empty:</span> {empty}
            </p>
            <p className="mb-4">
              <span className="font-bold">Head Growth:</span> {head_growth}
            </p>
            <p className="mb-4">
              <span className="font-bold">Tail Growth:</span> {tail_growth}
            </p>
            <p className="mb-4">
              <span className="font-bold">Next Dir:</span>{" "}
              {next_direction ? "SHRK" : "GROW"}
            </p>
            <p className="mb-4">
              <span className="font-bold">Last Dir:</span>{" "}
              {last_direction ? "SHRK" : "GROW"}
            </p>
          </div>

          {/* display ROB entries */}
          {DisplayROBData(ROB_entries, head, tail, true)}

          {/* output signals */}
          <div>
            <p className="mt-4 flex space-x-4">
              <span className="font-bold">Open Spots:</span> {open_spots}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ROBDebugger;
