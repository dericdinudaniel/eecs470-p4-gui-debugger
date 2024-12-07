import React, { useState } from "react";
import { ScopeData } from "@/lib/tstypes";
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

import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import { DButton } from "./dui/DButton";
import DisplayFU_TO_BS_DATA from "./DisplayFU_TO_BS_DATA";
import { Card, CardContent, CardHeader, CardHeaderSmall } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";
import * as Constants from "@/lib/constants";
import DisplayLoaf from "@/components/DisplayLoaf";

type FUDebuggerProps = {
  className: string;
  signalFU: ScopeData;
};

const FUDebugger: React.FC<FUDebuggerProps> = ({ className, signalFU }) => {
  const alu_data = extractSignalValue(signalFU, "alu_data").value;
  const mult_data = extractSignalValue(signalFU, "mult_data").value;
  const branch_data = extractSignalValue(signalFU, "branch_data").value;
  const load_data = extractSignalValue(signalFU, "load_data").value;
  const store_data = extractSignalValue(signalFU, "store_data").value;
  const FU_alu_data = parseFU_DATA_List(alu_data, Types.FU_TYPE.ALU);
  const FU_mult_data = parseFU_DATA_List(mult_data, Types.FU_TYPE.MUL);
  const FU_branch_data = parseFU_DATA_List(branch_data, Types.FU_TYPE.BR);
  const FU_load_data = parseFU_DATA_List(load_data, Types.FU_TYPE.LOAD);
  const FU_store_data = parseFU_DATA_List(store_data, Types.FU_TYPE.STORE);

  const alu_reg = extractSignalValue(signalFU, "alu_reg").value;
  const mult_reg = extractSignalValue(signalFU, "mult_reg").value;
  const branch_reg = extractSignalValue(signalFU, "branch_reg").value;
  const load_reg = extractSignalValue(signalFU, "load_reg").value;
  const store_reg = extractSignalValue(signalFU, "store_reg").value;
  const FU_alu_reg = parseFU_DATA_List(alu_reg, Types.FU_TYPE.ALU);
  const FU_mult_reg = parseFU_DATA_List(mult_reg, Types.FU_TYPE.MUL);
  const FU_branch_reg = parseFU_DATA_List(branch_reg, Types.FU_TYPE.BR);
  const FU_load_reg = parseFU_DATA_List(load_reg, Types.FU_TYPE.LOAD);
  const FU_store_reg = parseFU_DATA_List(store_reg, Types.FU_TYPE.STORE);

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

  //
  // Actual FUs
  // LOAF
  let fu_store = [];
  for (let i = 0; i < Constants.NUM_FU_LOAD; i++) {
    const loaf = (signalFU as any).children[
      `load_gen[${i}].bread`
    ] as ScopeData;
    fu_store.push(loaf);
  }

  const [showFUInputs, setShowFUInputs] = useState(true);
  return (
    <>
      <Module className={className}>
        {/* header */}

        <ModuleHeader label="FUs">
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
        </ModuleHeader>

        <ModuleContent>
          {/* inputs from RS */}
          {showFUInputs && (
            <>
              <div className="mt-2 justify-items-center">
                <Card className="space-y-2">
                  <CardHeader label="FU Ins" className="text-sm no-underline" />
                  <CardContent className="mt-0 space-y-2">
                    <div className="flex space-x-4">
                      {/* ALU */}
                      <div className="justify-items-center">
                        <CardHeaderSmall label="ALU IN" />
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
                        <CardHeaderSmall label="MULT IN" />
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
                        <CardHeaderSmall label="BRANCH IN" />
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
                    </div>

                    <div className="flex space-x-4">
                      {/* LOAD */}
                      <div className="justify-items-center">
                        <CardHeaderSmall label="LOAD IN" />
                        <div className="flex space-x-1">
                          {FU_load_data.map((fu_data, idx) => (
                            <div key={idx}>
                              <DisplaySingleFU_DATA
                                className=""
                                FUIdx={idx}
                                FUData={fu_data}
                                fu_type={Types.FU_TYPE.LOAD}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* STORE */}
                      <div className="justify-items-center">
                        <CardHeaderSmall label="STORE IN" />
                        <div className="flex space-x-1">
                          {FU_store_data.map((fu_data, idx) => (
                            <div key={idx}>
                              <DisplaySingleFU_DATA
                                className=""
                                FUIdx={idx}
                                FUData={fu_data}
                                fu_type={Types.FU_TYPE.STORE}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* FU Regs */}
          <div className="mt-2 justify-items-center">
            <Card className="space-y-2">
              <CardHeader label="FU Regs" className="text-sm no-underline" />
              <CardContent className="mt-0 space-y-2">
                <div className="flex space-x-4">
                  {/* ALU */}
                  <div className="justify-items-center">
                    <CardHeaderSmall label="ALU IN" />
                    <div className="flex space-x-1">
                      {FU_alu_reg.map((fu_data, idx) => (
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
                    <CardHeaderSmall label="MULT IN" />
                    <div className="flex space-x-1">
                      {FU_mult_reg.map((fu_data, idx) => (
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
                    <CardHeaderSmall label="BRANCH IN" />
                    <div className="flex space-x-1">
                      {FU_branch_reg.map((fu_data, idx) => (
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
                </div>

                <div className="flex space-x-4">
                  {/* LOAD */}
                  <div className="justify-items-center">
                    <CardHeaderSmall label="LOAD IN" />
                    <div className="flex space-x-1">
                      {FU_load_reg.map((fu_data, idx) => (
                        <div key={idx}>
                          <DisplaySingleFU_DATA
                            className=""
                            FUIdx={idx}
                            FUData={fu_data}
                            fu_type={Types.FU_TYPE.LOAD}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STORE */}
                  <div className="justify-items-center">
                    <CardHeaderSmall label="STORE IN" />
                    <div className="flex space-x-1">
                      {FU_store_reg.map((fu_data, idx) => (
                        <div key={idx}>
                          <DisplaySingleFU_DATA
                            className=""
                            FUIdx={idx}
                            FUData={fu_data}
                            fu_type={Types.FU_TYPE.STORE}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FUs */}
          <div className="mt-2">
            {/* loads */}
            <Card className="">
              <CardHeader label="Loads" className="text-sm no-underline" />
              <CardContent className="flex gap-x-2">
                {fu_store.map((load, idx) => {
                  return (
                    <div key={idx}>
                      <DisplayLoaf className="" signalLoaf={load} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </ModuleContent>
      </Module>
    </>
  );
};

export default FUDebugger;
