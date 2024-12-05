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
import { Card } from "./dui/Card";

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
  const RS_mult_out = parseRS_TO_FU_DATA_List(mult_out, Types.FU_TYPE.MUL);
  const RS_alu_out = parseRS_TO_FU_DATA_List(alu_out, Types.FU_TYPE.ALU);
  const RS_branch_out = parseRS_TO_FU_DATA_List(branch_out, Types.FU_TYPE.BR);

  const open_spots = extractSignalValueToInt(signalRS, "open_spots");

  const [showRSInputs, setShowRSInputs] = useState(true);
  const [showRSOutputs, setShowRSOutputs] = useState(true);

  return (
    <>
      <Module className={className}>
        {/* header */}
        <ModuleHeader label="RS">
          <p className="pl-3">
            <span className="font-semibold">(Open Spots: </span>
            {Number.isNaN(open_spots) ? "X" : open_spots})
          </p>
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
                <p className="font-semibold">Decoded Instructions</p>
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
            className=""
            RSData={RS_entries}
            EarlyCDB={RS_early_cdb}
          />

          {/* display outputs */}
          {showRSOutputs && (
            <div className="mt-2 justify-items-center">
              <Card className="flex space-x-4">
                {/* ALU */}
                <div className="justify-items-center">
                  <p className="font-semibold">
                    # ALU OUT: {getNumFUOut(RS_alu_out)}
                  </p>
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
                  <p className="font-semibold">
                    # MULT OUT: {getNumFUOut(RS_mult_out)}
                  </p>
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
                  <p className="font-semibold">
                    # BR OUT: {getNumFUOut(RS_branch_out)}
                  </p>
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
              </Card>
            </div>
          )}
        </ModuleContent>
      </Module>
    </>
  );
};

export default RSDebugger;
