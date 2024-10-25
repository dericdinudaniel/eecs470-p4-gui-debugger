import React, { useState } from "react";
import {
  extractSignalValue,
  extractSignalValueToInt,
  parseROBData,
  parseCDBData,
} from "@/lib/utils";
import * as Constants from "@/lib/constants";
import * as Types from "@/lib/types";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";
import DisplayROBData from "./DisplayROBData";
import DisplayCDBData from "./DisplayCDBData";

type ROBDebuggerProps = {
  className: string;
  signalData: ScopeData;
};

const ROBDebugger: React.FC<ROBDebuggerProps> = ({ className, signalData }) => {
  // input signals
  const dispatched_ins = extractSignalValue(signalData, "dispatched_ins").value;
  const ROB_dispatched_ins = parseROBData(dispatched_ins, Constants.N);
  const cdb = extractSignalValue(signalData, "cdb").value;
  const ROB_cdb = parseCDBData(cdb);

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

  // State to control visibility of stuff
  const [showROBInternals, setShowROBInternals] = useState(false);
  const [showROBInputs, setShowROBInputs] = useState(false);

  return (
    <>
      <div className={`${className} mt-4`}>
        <div className="bg-gray-500/[.15] rounded-lg shadow-lg p-4 inline-flex flex-col items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">
              ROB (size = {Constants.ROB_SZ})
            </h2>
            {/* Toggle buttons */}
            <div className="pl-3 space-x-2">
              <button
                className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600  text-xs"
                onClick={() => setShowROBInputs(!showROBInputs)}
              >
                {showROBInputs ? "Hide ROB Inputs" : "Show ROB Inputs"}
              </button>
              <button
                className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600  text-xs"
                onClick={() => setShowROBInternals(!showROBInternals)}
              >
                {showROBInternals ? "Hide ROB Internals" : "Show ROB Internals"}
              </button>
            </div>
          </div>

          {/* display inputs */}
          {showROBInputs && (
            <div className="flex space-x-4 mb-2">
              <div className="justify-items-center">
                <p>Dispatched Instructions</p>
                <DisplayROBData
                  className=""
                  ROBData={ROB_dispatched_ins}
                  head={-1}
                  tail={-1}
                  isROB={false}
                />
              </div>
              <div className="justify-items-center">
                <p>CDB</p>
                <DisplayCDBData className="" CDBData={ROB_cdb} />
              </div>
            </div>
          )}

          {/* display ROB internals */}
          {showROBInternals && (
            <div className="flex space-x-4">
              <div>
                <p className="text-xs">
                  <span className="font-bold">Available Spots:</span>{" "}
                  {available_spots}
                </p>
                <p className="text-xs">
                  <span className="font-bold">Retireable Count:</span>{" "}
                  {retireable_cnt}
                </p>
              </div>
              <p className="text-xs">
                <span className="font-bold">Empty:</span> {empty}
              </p>
              <div>
                <p className="text-xs">
                  <span className="font-bold">Head Growth:</span> {head_growth}
                </p>
                <p className="text-xs">
                  <span className="font-bold">Tail Growth:</span> {tail_growth}
                </p>
              </div>
              <div>
                <p className="text-xs">
                  <span className="font-bold">Next Dir:</span>{" "}
                  {next_direction ? "SHRK" : "GROW"}
                </p>
                <p className="text-xs">
                  <span className="font-bold">Last Dir:</span>{" "}
                  {last_direction ? "SHRK" : "GROW"}
                </p>
              </div>
            </div>
          )}

          {/* display ROB entries */}
          <DisplayROBData
            className="pt-2"
            ROBData={ROB_entries}
            head={head}
            tail={tail}
            isROB={true}
          />

          {/* output signals */}
          <div>
            <p className="text-sm mt-4 flex space-x-4">
              <span className="font-bold">Open Spots:</span> {open_spots}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ROBDebugger;
