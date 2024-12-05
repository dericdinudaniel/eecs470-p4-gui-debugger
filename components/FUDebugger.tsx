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
  parseFU_TO_BS_DATA,
} from "@/lib/utils";
import DisplaySingleFU_DATA from "./DisplaySingleFU_DATA";
import DisplayCDBData from "./DisplayCDBData";
import { reverseStr } from "@/lib/tsutils";
import { ModuleBase, ModuleHeader } from "./dui/Module";
import { DButton } from "./dui/DButton";
import DisplayFU_TO_BS_DATA from "./DisplayFU_TO_BS_DATA";
import { CardBase, CardHeaderSmall } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";

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

  const early_cdb_tags = extractSignalValue(signalFU, "early_cdb_tags").value;
  const FU_early_cdb_tags = parseCDBTags(early_cdb_tags);

  const cdb_tags = extractSignalValue(signalFU, "cdb_tags").value;
  const FU_cdb_tags = parseCDBTags(cdb_tags);

  const cdb_values = extractSignalValue(signalFU, "cdb_values").value;
  const FU_cdb_values = parseCDBValues(cdb_values);

  const branch_results = extractSignalValue(signalFU, "branch_results").value;
  const FU_branch_results = parseFU_TO_BS_DATA(branch_results);

  const [showFUInputs, setShowFUInputs] = useState(true);
  const [showFU, setShowFU] = useState(true);

  return (
    <>
      <ModuleBase className={className}>
        {/* header */}
        <div className="flex items-center">
          <ModuleHeader onClick={() => setShowFU(!showFU)}>FUs</ModuleHeader>
          <DButton
            className="ml-3"
            onClick={() => setShowFUInputs(!showFUInputs)}
          >
            {showFUInputs ? "Hide FU Inputs" : "Show RS Inputs"}
          </DButton>
          <DisplayCDBData
            className="ml-4"
            CDBTags={FU_early_cdb_tags}
            isEarlyCDB={true}
          />
          <DisplayCDBData
            className="ml-4"
            CDBTags={FU_cdb_tags}
            CDBData={FU_cdb_values}
            isEarlyCDB={false}
          />

          <div className="ml-4">
            <SimpleValDisplay
              label="Branch Resolve Status: "
              className={`p-1 ${
                b_mask_mask_status == Types.BRANCH_PREDICT_T.CORRECT_PRED
                  ? "rounded-lg bg-veryGood"
                  : b_mask_mask_status == Types.BRANCH_PREDICT_T.MISPREDICT
                  ? "rounded-lg bg-veryBad"
                  : ""
              }`}
              labelClassName="text-base"
            >
              {Types.getBranchPredictName(b_mask_mask_status)}
            </SimpleValDisplay>

            <SimpleValDisplay
              label="B Mask Mask: "
              className="pl-1"
              labelClassName=" text-base"
            >
              {b_mask_mask}
            </SimpleValDisplay>
          </div>
          <DisplayFU_TO_BS_DATA className="ml-2" data={FU_branch_results} />
        </div>

        {showFU && (
          <>
            {/* inputs from RS */}
            {showFUInputs && (
              <>
                <div className="mt-2 justify-items-center">
                  <CardBase className="flex space-x-4">
                    {/* ALU */}
                    <div className="justify-items-center">
                      <CardHeaderSmall>ALU IN</CardHeaderSmall>
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
                      <CardHeaderSmall>MULT IN</CardHeaderSmall>
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
                      <CardHeaderSmall>BRANCH IN</CardHeaderSmall>
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
                    </div>
                  </CardBase>
                </div>
              </>
            )}

            {/* FUs */}
          </>
        )}
      </ModuleBase>
    </>
  );
};

export default FUDebugger;
