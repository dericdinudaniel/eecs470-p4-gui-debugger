import React, { useState } from "react";
import {
  extractSignalValue,
  extractSignalValueToInt,
  parseRSData,
  parseCDBTags,
  getNumFUOut,
  parseRS_TO_FU_DATA_List,
} from "@/lib/utils";
import { reverseStr } from "@/lib/tsutils";
import * as Types from "@/lib/types";
import { ScopeData } from "@/lib/tstypes";
import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import DisplayFUAvailTable from "./DisplayFUAvailTable";
import DisplayCDBData from "./DisplayCDBData";
import DisplayRSData from "./DisplayRSData";
import DisplaySingleRS from "./DisplaySingleRS";
import DisplaySingleRS_TO_FU_DATA from "./DisplaySingleRS_TO_FU_DATA";
import { DButton } from "./dui/DButton";
import { Card, CardContent, CardHeader, CardHeaderSmall } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";

type RSDebuggerProps = {
  className: string;
  signalRS: ScopeData;
  signalSQ: ScopeData;
};

const RSDebugger: React.FC<RSDebuggerProps> = ({
  className,
  signalRS,
  signalSQ,
}) => {
  // inputs
  const decoded_instruction = extractSignalValue(
    signalRS,
    "decoded_instruction"
  ).value;
  const RS_decoded_instruction = parseRSData(decoded_instruction);

  const alu_avail = extractSignalValue(signalRS, "alu_avail");
  const branch_avail = extractSignalValue(signalRS, "branch_avail");
  const mult_avail = extractSignalValue(signalRS, "mult_avail");
  const store_avail = extractSignalValue(signalRS, "store_avail");
  const load_avail = extractSignalValue(signalRS, "load_avail");

  const early_cdb = extractSignalValue(signalRS, "early_cdb").value;
  const RS_early_cdb = parseCDBTags(early_cdb);

  // entries
  const entries = extractSignalValue(signalRS, "entries").value;
  const RS_entries = parseRSData(entries);

  // outputs
  const mult_out = extractSignalValue(signalRS, "mult_out").value;
  const alu_out = extractSignalValue(signalRS, "alu_out").value;
  const branch_out = extractSignalValue(signalRS, "branch_out").value;
  const load_out = extractSignalValue(signalRS, "load_out").value;
  const store_out = extractSignalValue(signalRS, "store_out").value;
  const RS_mult_out = parseRS_TO_FU_DATA_List(mult_out, Types.FU_TYPE.MUL);
  const RS_alu_out = parseRS_TO_FU_DATA_List(alu_out, Types.FU_TYPE.ALU);
  const RS_branch_out = parseRS_TO_FU_DATA_List(branch_out, Types.FU_TYPE.BR);
  const RS_load_out = parseRS_TO_FU_DATA_List(load_out, Types.FU_TYPE.LOAD);
  const RS_store_out = parseRS_TO_FU_DATA_List(store_out, Types.FU_TYPE.STORE);

  const entries_cnt = extractSignalValueToInt(signalRS, "entries_cnt");
  const available_spots = RS_entries.length - entries_cnt;

  const [showRSInputs, setShowRSInputs] = useState(true);
  const [showRSOutputs, setShowRSOutputs] = useState(true);

  return (
    <>
      <Module className={className}>
        {/* header */}
        <ModuleHeader label="RS">
          <SimpleValDisplay label="(Avail. Spots: " className="pl-3">
            {Number.isNaN(available_spots) ? "X" : available_spots}
            {")"}
          </SimpleValDisplay>
          {/* Toggle buttons */}
          <div className="pl-3 space-x-2">
            <DButton onClick={() => setShowRSInputs(!showRSInputs)}>
              {showRSInputs ? "Hide RS Inputs" : "Show RS Inputs"}
            </DButton>
            <DButton onClick={() => setShowRSOutputs(!showRSOutputs)}>
              {showRSOutputs ? "Hide RS Outputs" : "Show RS Outputs"}
            </DButton>
          </div>
        </ModuleHeader>

        <ModuleContent>
          {/* display inputs */}
          {showRSInputs && (
            <div className="flex space-x-2 items-start mt-2">
              <Card>
                <div className="flex gap-x-2">
                  <DisplayFUAvailTable
                    className=""
                    aluAvail={reverseStr(alu_avail.value)}
                    branchAvail={reverseStr(branch_avail.value)}
                    multAvail={reverseStr(mult_avail.value)}
                    storeAvail={reverseStr(store_avail.value)}
                    loadAvail={reverseStr(load_avail.value)}
                  />
                  <DisplayCDBData
                    className=""
                    CDBTags={RS_early_cdb}
                    isEarlyCDB={true}
                  />
                </div>
              </Card>
              <Card>
                <p className="font-semibold">Dispatched Instructions</p>
                <div className="flex space-x-1">
                  {RS_decoded_instruction.map((rs, idx) => (
                    <div key={idx}>
                      <DisplaySingleRS className="" RSIdx={idx} RSData={rs} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* display RS entries */}
          <DisplayRSData
            className="mt-2"
            RSData={RS_entries}
            EarlyCDB={RS_early_cdb}
            signalSQ={signalSQ}
          />

          {/* display outputs */}
          {showRSOutputs && (
            <div className="mt-2 justify-items-center">
              <Card>
                <CardHeader label="FU Outs" className="text-sm no-underline" />
                <CardContent className="mt-0 space-y-2">
                  <div className="flex space-x-4">
                    {/* ALU */}
                    <div className="justify-items-center">
                      <CardHeaderSmall
                        label={`# ALU OUT: ${getNumFUOut(RS_alu_out)}`}
                      />
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

                    {/* MULT */}
                    <div className="justify-items-center">
                      <CardHeaderSmall
                        label={`# MULT OUT: ${getNumFUOut(RS_mult_out)}`}
                      />

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

                    {/* BRANCH */}
                    <div className="justify-items-center">
                      <CardHeaderSmall
                        label={`# BR OUT: ${getNumFUOut(RS_branch_out)}`}
                      />

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

                  <div className="flex space-x-4">
                    {/* LOAD */}
                    <div className="justify-items-center">
                      <CardHeaderSmall
                        label={`# LOAD OUT: ${getNumFUOut(RS_load_out)}`}
                      />
                      <div className="flex space-x-1">
                        {RS_load_out.map((fu_data, idx) => (
                          <div key={idx}>
                            <DisplaySingleRS_TO_FU_DATA
                              className=""
                              FUIdx={idx}
                              RS_TO_FUData={fu_data}
                              fu_type={Types.FU_TYPE.LOAD}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* STORE */}
                    <div className="justify-items-center">
                      <CardHeaderSmall
                        label={`# STORE OUT: ${getNumFUOut(RS_store_out)}`}
                      />

                      <div className="flex space-x-1">
                        {RS_store_out.map((fu_data, idx) => (
                          <div key={idx}>
                            <DisplaySingleRS_TO_FU_DATA
                              className=""
                              FUIdx={idx}
                              RS_TO_FUData={fu_data}
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
          )}
        </ModuleContent>
      </Module>
    </>
  );
};

export default RSDebugger;
