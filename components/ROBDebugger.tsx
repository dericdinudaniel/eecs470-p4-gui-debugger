import React, { useState } from "react";
import {
  extractSignalValue,
  extractSignalValueToInt,
  parseROBData,
} from "@/lib/utils";
import * as Constants from "@/lib/constants";
import * as Types from "@/lib/types";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";
import DisplayROBData from "./DisplayROBData";

type ROBDebuggerProps = {
  className: string;
  signalData: ScopeData;
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
          <DisplayROBData
            className=""
            ROBData={ROB_dispatched_ins}
            head={-1}
            tail={-1}
            isROB={false}
          />

          {/* display ROB internals */}
          <div className="flex space-x-4 mt-4">
            <p className="mb-4 w-[12rem] mr-[-.8rem]">
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
          <DisplayROBData
            className=""
            ROBData={ROB_entries}
            head={head}
            tail={tail}
            isROB={true}
          />

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
