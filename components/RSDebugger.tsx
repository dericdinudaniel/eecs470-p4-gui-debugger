import React, { useState } from "react";
import {
  extractSignalValue,
  extractSignalValueToInt,
  parseRSData,
  parseCDBData,
} from "@/lib/utils";
import * as Constants from "@/lib/constants";
import * as Types from "@/lib/types";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";
import DisplayFUAvailTable from "./DisplayFUAvailTable";
import DisplayCDBData from "./DisplayCDBData";
import DisplayRSData from "./DisplayRSData";
import DisplaySingleRS from "./DisplaySingleRS";

type RSDebuggerProps = {
  className: string;
  signalData: ScopeData;
};

const RSDebugger: React.FC<RSDebuggerProps> = ({ className, signalData }) => {
  // inputs
  const decoded_instruction = extractSignalValue(
    signalData,
    "decoded_instruction"
  ).value;
  const RS_decoded_instruction = parseRSData(decoded_instruction, Constants.N);

  const alu_avail = extractSignalValue(signalData, "alu_avail");
  const branch_avail = extractSignalValue(signalData, "branch_avail");
  const mult_avail = extractSignalValue(signalData, "mult_avail");

  const early_cdb = extractSignalValue(signalData, "early_cdb").value;
  const RS_early_cdb = parseCDBData(early_cdb);

  // entries
  const entries = extractSignalValue(signalData, "entries").value;
  const RS_entries = parseRSData(entries, Constants.RS_SZ);

  const [showRSInputs, setShowRSInputs] = useState(false);
  const [showRSOutputs, setShowRSOutputs] = useState(false);

  return (
    <>
      <div className={`${className} mt-4`}>
        <div className="bg-gray-200/[.15] rounded-lg shadow-lg p-4 inline-flex flex-col items-center">
          {/* header */}
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">
              RS (size = {Constants.RS_SZ})
            </h2>
            {/* Toggle buttons */}
            <div className="pl-3 space-x-2">
              <button
                className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600  text-xs"
                onClick={() => setShowRSInputs(!showRSInputs)}
              >
                {showRSInputs ? "Hide RS Inputs" : "Show RS Inputs"}
              </button>
            </div>
          </div>

          {/* display inputs */}
          {showRSInputs && (
            <div>
              <div className="flex space-x-2">
                <div className="justify-items-center">
                  <p>FU Avail</p>
                  <DisplayFUAvailTable
                    className=""
                    aluAvail={alu_avail.value}
                    branchAvail={branch_avail.value}
                    multAvail={mult_avail.value}
                    numAlu={Constants.NUM_FU_ALU}
                    numBranch={Constants.NUM_FU_BRANCH}
                    numMult={Constants.NUM_FU_MULT}
                  />
                </div>
                <div className="justify-items-center">
                  <p>Early CDB</p>
                  <DisplayCDBData className="" CDBData={RS_early_cdb} />
                </div>
                <div className="justify-items-center">
                  <p>Decoded Instructions</p>
                  <div className="flex space-x-1 bg-gray-200 shadow-lg p-2 rounded-xl">
                    {RS_decoded_instruction.map((rs, idx) => (
                      <div
                        key={idx}
                        className="items-center rounded-xl shadow-lg"
                      >
                        <DisplaySingleRS className="" RSIdx={idx} RSData={rs} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* display RS entries */}
          <DisplayRSData className="pt-2" RSData={RS_entries} />

          {/* display outputs */}
          {showRSOutputs && <div className="flex space-x-4"></div>}
        </div>
      </div>
    </>
  );
};

export default RSDebugger;
