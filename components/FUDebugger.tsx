import React, { useState } from "react";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";
import * as Types from "@/lib/types";
import {
  extractSignalValue,
  extractSignalValueToInt,
  parseBoolArrToString,
  parseCDBTags,
  parseCDBValues,
  parseFU_DATA_List,
} from "@/lib/utils";
import DisplaySingleFU_DATA from "./DisplaySingleFU_DATA";
import DisplayCDBData from "./DisplayCDBData";
import { reverseStr } from "@/lib/tsutils";

type FUDebuggerProps = {
  className: string;
  signalFU: ScopeData;
};

const FUDebugger: React.FC<FUDebuggerProps> = ({ className, signalFU }) => {
  const alu_data = extractSignalValue(signalFU, "alu_data").value;
  const mult_data = extractSignalValue(signalFU, "mult_data").value;
  const branch_data = extractSignalValue(signalFU, "branch_data").value;

  const FU_alu_data = parseFU_DATA_List(alu_data, Types.FU_TYPE.ALU);
  const FU_mult_data = parseFU_DATA_List(mult_data, Types.FU_TYPE.MUL);
  const FU_branch_data = parseFU_DATA_List(branch_data, Types.FU_TYPE.BR);

  const b_mask_mask_status = extractSignalValueToInt(
    signalFU,
    "b_mask_mask_status"
  ) as Types.BRANCH_PREDICT_T;
  const b_mask_mask = parseBoolArrToString(
    extractSignalValue(signalFU, "b_mask_mask").value
  );

  const cdb_tags = extractSignalValue(signalFU, "cdb_tags").value;
  const FU_cdb_tags = parseCDBTags(cdb_tags);

  const cdb_values = extractSignalValue(signalFU, "cdb_values").value;
  const FU_cdb_values = parseCDBValues(cdb_values);

  // update later
  const branch_results_out = extractSignalValue(
    signalFU,
    "branch_results_out"
  ).value;
  let FU_branch_results_out = branch_results_out.startsWith("b")
    ? branch_results_out.slice(1)
    : branch_results_out;
  FU_branch_results_out = reverseStr(FU_branch_results_out);

  let b_mask = extractSignalValue(signalFU, "b_mask").value.slice(1);
  b_mask = reverseStr(b_mask);

  const [showFUInputs, setShowFUInputs] = useState(true);
  return (
    <>
      <div className={`${className} mt-4`}>
        <div className="bg-gray-500/[.15] rounded-lg shadow-lg p-4 inline-flex flex-col items-center">
          {/* header */}
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">FUs</h2>
            <button
              className="ml-3 bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600  text-xs"
              onClick={() => setShowFUInputs(!showFUInputs)}
            >
              {showFUInputs ? "Hide FU Inputs" : "Show RS Inputs"}
            </button>
            <DisplayCDBData
              className="ml-4"
              CDBTags={FU_cdb_tags}
              CDBData={FU_cdb_values}
              isEarlyCDB={false}
            />

            <div className="ml-4">
              <div
                className={`${
                  b_mask_mask_status ==
                  Types.BRANCH_PREDICT_T.CORRECTLY_PREDICTED
                    ? "bg-green-300"
                    : b_mask_mask_status == Types.BRANCH_PREDICT_T.MISPREDICTED
                    ? "bg-red-300"
                    : ""
                }`}
              >
                <span className="font-bold">Branch Resolve Status: </span>
                {Types.getBranchPredictName(b_mask_mask_status)}
              </div>
              <div>
                <span className="font-bold">B Mask Mask: </span>
                {b_mask_mask}
              </div>
            </div>
          </div>

          {/* inputs from RS */}
          {showFUInputs && (
            <>
              <div className="mt-2 justify-items-center">
                <div className="flex space-x-4">
                  {/* ALU */}
                  <div className="justify-items-center">
                    <p>ALU IN</p>
                    <div className="flex space-x-1">
                      {FU_alu_data.map((fu_data, idx) => (
                        <div key={idx}>
                          <DisplaySingleFU_DATA
                            className=""
                            FUIdx={idx}
                            FUData={fu_data}
                            fu_type={Types.FU_TYPE.ALU}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MULT */}
                  <div className="justify-items-center">
                    <p>MULT IN</p>
                    <div className="flex space-x-1">
                      {FU_mult_data.map((fu_data, idx) => (
                        <div key={idx}>
                          <DisplaySingleFU_DATA
                            className=""
                            FUIdx={idx}
                            FUData={fu_data}
                            fu_type={Types.FU_TYPE.MUL}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BRANCH */}
                  <div className="justify-items-center">
                    <p>BRANCH IN</p>
                    <div className="flex space-x-1">
                      {FU_branch_data.map((fu_data, idx) => (
                        <div key={idx}>
                          <DisplaySingleFU_DATA
                            className=""
                            FUIdx={idx}
                            FUData={fu_data}
                            fu_type={Types.FU_TYPE.BR}
                          />
                        </div>
                      ))}
                    </div>
                    <div>branch_results_out: {FU_branch_results_out}</div>
                    <div>b_mask: {b_mask}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* FUs */}
        </div>
      </div>
    </>
  );
};

export default FUDebugger;
