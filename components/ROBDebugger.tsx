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

const parseROBEntries = (entries: string): Types.ROB_DATA[] => {
  // Remove the 'b' prefix if present
  const binaryStr = entries.startsWith("b") ? entries.slice(1) : entries;

  // Convert string to array of bits
  const bits = binaryStr.split("").map(Number);

  const result: Types.ROB_DATA[] = [];
  const entryWidth = Types.ROB_DATA_WIDTH;

  /// Helper function to extract bits and convert to number
  const extractBits = (startIndex: number, length: number): number => {
    const bitsSlice = binaryStr.slice(startIndex, startIndex + length);
    return parseInt(bitsSlice, 2);
  };

  for (let i = 0; i < Constants.ROB_SZ; i++) {
    const startIdx = binaryStr.length - (i + 1) * entryWidth;

    // Extract each field
    const retireable = binaryStr[startIdx] === "1";
    const valid = binaryStr[startIdx + 1] === "1";

    const R_dest = extractBits(startIdx + 2, Types.REG_IDX_WIDTH);
    const T_new = extractBits(
      startIdx + 2 + Types.REG_IDX_WIDTH,
      Types.PHYS_REG_TAG_WIDTH
    );
    const T_old = extractBits(
      startIdx + 2 + Types.REG_IDX_WIDTH + Types.PHYS_REG_TAG_WIDTH,
      Types.PHYS_REG_TAG_WIDTH
    );

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

  // internal signals
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
  const ROB_entries = parseROBEntries(entries);

  // output signals
  const open_spots = extractSignalValueToInt(signalData, "open_spots");

  return (
    <>
      <div className={`${className}`}>
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 inline-flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4  ">
            ROB (size = {Constants.ROB_SZ})
          </h2>
          {/* display ROB status */}
          <div className="flex space-x-4">
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
              <span className="font-bold">Next Direction:</span>{" "}
              {next_direction}
            </p>
            <p className="mb-4">
              <span className="font-bold">Last Direction:</span>{" "}
              {last_direction}
            </p>
          </div>

          {/* display ROB. */}
          {/* each entry should display the following fields:
            - entry number
            - R_dest
            - T_new
            - T_old
            - valid
            - retireable
        */}
          {/* If an entry is the head or tail, the entry should be higlighted and there should be an arrow pointing to it on the right side indicating if it is head or tail */}
          {/* The entry number can be multiple digits, they should all be right aligned */}
          {/* display table header on top in this order: # entry number, T_new, T_old, valid, retirable, R_dest */}
          <table className={className}>
            <thead className="border-b">
              <tr>
                <th className=" p-2">Entry #</th>
                <th className=" border-l p-2">T_new</th>
                <th className=" border-l p-2">T_old</th>
                <th className=" border-l p-2">Valid</th>
                <th className=" border-l p-2">Retirable</th>
                <th className=" border-l p-2">R_dest</th>
                <th className=" border-l p-2 pl-9">Head/Tail</th>
              </tr>
            </thead>
            <tbody>
              {ROB_entries.map((entry, idx) => {
                const isHead = head === idx;
                const isTail = tail === idx;
                const isBoth = isHead && isTail;
                const isEither = isHead || isTail;

                const entryNumber = idx.toString().padStart(2, "") + ":";

                // Helper function to display the value or "NaN"
                const displayValue = (value: any) =>
                  isNaN(value) ? "NaN" : value;

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
                      {"p" + displayValue(entry.T_new)}
                    </td>
                    <td className="text-center border-l">
                      {"p" + displayValue(entry.T_old)}
                    </td>
                    <td className="text-center border-l">
                      {displayValue(entry.valid ? "1" : "0")}
                    </td>
                    <td className="text-center border-l">
                      {displayValue(entry.retireable ? "1" : "0")}
                    </td>
                    <td className="text-center border-l">
                      {"r" + displayValue(entry.R_dest)}
                    </td>
                    <td className="text-center border-l pl-3">
                      {isEither && headOrTailString}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

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
