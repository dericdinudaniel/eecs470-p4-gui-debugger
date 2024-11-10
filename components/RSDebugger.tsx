import React, { useState } from "react";
import {
  extractSignalValue,
  extractSignalValueToInt,
  parseRSData,
  parseCDBData,
  parseListFU_DATA,
  getNumFUOut,
  parseRS_TO_FU_DATA_List,
} from "@/lib/utils";
import { reverseStr } from "@/lib/tsutils";
import * as Constants from "@/lib/constants";
import * as Types from "@/lib/types";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";
import DisplayFUAvailTable from "./DisplayFUAvailTable";
import DisplayCDBData from "./DisplayCDBData";
import DisplayRSData from "./DisplayRSData";
import DisplaySingleRS from "./DisplaySingleRS";
import DisplaySingleRS_TO_FU_DATA from "./DisplaySingleRS_TO_FU_DATA";

type RSDebuggerProps = {
  className: string;
  signalRS: ScopeData;
};

const RSDebugger: React.FC<RSDebuggerProps> = ({ className, signalRS }) => {
  // inputs
  const decoded_instruction = extractSignalValue(
    signalRS,
    "decoded_instruction"
  ).value;
  const RS_decoded_instruction = parseRSData(decoded_instruction, Constants.N);

  const alu_avail = extractSignalValue(signalRS, "alu_avail");
  const branch_avail = extractSignalValue(signalRS, "branch_avail");
  const mult_avail = extractSignalValue(signalRS, "mult_avail");

  const early_cdb = extractSignalValue(signalRS, "early_cdb").value;
  const RS_early_cdb = parseCDBData(early_cdb);

  // entries
  const entries = extractSignalValue(signalRS, "entries").value;
  const RS_entries = parseRSData(entries, Constants.RS_SZ);

  // outputs
  const mult_out = extractSignalValue(signalRS, "mult_out").value;
  const alu_out = extractSignalValue(signalRS, "alu_out").value;
  const branch_out = extractSignalValue(signalRS, "branch_out").value;
  const RS_mult_out = parseRS_TO_FU_DATA_List(mult_out, Types.FU_TYPE.MUL);
  const RS_alu_out = parseRS_TO_FU_DATA_List(alu_out, Types.FU_TYPE.ALU);
  const RS_branch_out = parseRS_TO_FU_DATA_List(branch_out, Types.FU_TYPE.BR);

  const open_spots = extractSignalValueToInt(signalRS, "open_spots");

  const [showRSInputs, setShowRSInputs] = useState(true);
  const [showRSOutputs, setShowRSOutputs] = useState(true);

  console.log("Types.RS_DATA_WIDTH", Types.RS_DATA_WIDTH);
  console.log("Types.FU_TYPE_WIDTH", Types.FU_TYPE_WIDTH);
  console.log("Types.FU_FUNC_WIDTH", Types.FU_FUNC_WIDTH);
  console.log("Types.PHYS_REG_TAG_WIDTH", Types.PHYS_REG_TAG_WIDTH);
  console.log("Constants.NUM_CHECKPOINTS", Constants.NUM_CHECKPOINTS);

  return (
    <>
      <div className={`${className} mt-4`}>
        <div className="bg-gray-500/[.15] rounded-lg shadow-lg p-4 inline-flex flex-col items-center">
          {/* header */}
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">
              RS (size = {Constants.RS_SZ})
            </h2>
            <p className="pl-3">
              Open Spots: {Number.isNaN(open_spots) ? "X" : open_spots}
            </p>
            {/* Toggle buttons */}
            <div className="pl-3 space-x-2">
              <button
                className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600  text-xs"
                onClick={() => setShowRSInputs(!showRSInputs)}
              >
                {showRSInputs ? "Hide RS Inputs" : "Show RS Inputs"}
              </button>
              <button
                className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600  text-xs"
                onClick={() => setShowRSOutputs(!showRSOutputs)}
              >
                {showRSOutputs ? "Hide RS Outputs" : "Show RS Outputs"}
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
                    aluAvail={reverseStr(alu_avail.value)}
                    branchAvail={reverseStr(branch_avail.value)}
                    multAvail={reverseStr(mult_avail.value)}
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
          <DisplayRSData
            className=""
            RSData={RS_entries}
            EarlyCDB={RS_early_cdb}
          />

          {/* display outputs */}
          {showRSOutputs && (
            <div className="mt-2 justify-items-center">
              <div className="flex space-x-4">
                {/* MULT */}
                <div className="justify-items-center">
                  <p># MULT OUT: {getNumFUOut(RS_mult_out)}</p>
                  <div className="flex space-x-1">
                    {RS_mult_out.map((fu_data, idx) => (
                      <div key={idx}>
                        <DisplaySingleRS_TO_FU_DATA
                          className=""
                          FUIdx={idx}
                          RS_TO_FUData={fu_data}
                          fu_type={Types.FU_TYPE.MUL}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ALU */}
                <div className="justify-items-center">
                  <p># ALU OUT: {getNumFUOut(RS_alu_out)}</p>
                  <div className="flex space-x-1">
                    {RS_alu_out.map((fu_data, idx) => (
                      <div key={idx}>
                        <DisplaySingleRS_TO_FU_DATA
                          className=""
                          FUIdx={idx}
                          RS_TO_FUData={fu_data}
                          fu_type={Types.FU_TYPE.ALU}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* BRANCH */}
                <div className="justify-items-center">
                  <p># BR OUT: {getNumFUOut(RS_branch_out)}</p>
                  <div className="flex space-x-1">
                    {RS_branch_out.map((fu_data, idx) => (
                      <div key={idx}>
                        <DisplaySingleRS_TO_FU_DATA
                          className=""
                          FUIdx={idx}
                          RS_TO_FUData={fu_data}
                          fu_type={Types.FU_TYPE.BR}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RSDebugger;
