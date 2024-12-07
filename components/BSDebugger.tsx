import React, { useState } from "react";
import { ScopeData } from "@/lib/tstypes";
import {
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parseBoolArrToString,
  parseCDBTags,
  parseCHECKPOINT_DATA,
  parseCHECKPOINT_DATA_List,
  parseFU_TO_BS_DATA,
} from "@/lib/utils";
import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import * as Types from "@/lib/types";
import DisplayFrizzyList from "./DisplayFrizzyList";
import DisplayMapTable from "./DisplayMapTable";
import DisplayCDBData from "./DisplayCDBData";
import { DButton } from "./dui/DButton";
import DisplayFU_TO_BS_DATA from "./DisplayFU_TO_BS_DATA";
import { Card } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";

interface BSDebuggerProps {
  className: string;
  signalBS: ScopeData;
}

const DisplaySingleCheckpoint: React.FC<{
  className?: string;
  checkpoint: Types.CHECKPOINT_DATA;
  idx?: number;
  valid?: boolean;
}> = ({ className = "", checkpoint, idx, valid }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Define background color based on validity
  const backgroundColor =
    valid !== undefined ? (valid ? "bg-good" : "bg-bad") : "bg-neutral";

  return (
    <div className={`${className}`}>
      <div className={`p-2 pb-0 rounded-lg border ${backgroundColor}`}>
        {idx !== undefined && (
          <h2 className="text-md font-semibold text-center mb-1">
            Stack #{idx}
          </h2>
        )}
        <div className="flex items-center">
          <div className="space-y-[-.35rem] mt-[-.4rem]">
            <SimpleValDisplay label="Branch PC: ">
              {displayValueHex(checkpoint.branch_PC)}
            </SimpleValDisplay>

            <SimpleValDisplay label="BHR: ">
              {checkpoint.checkpointed_bhr}
            </SimpleValDisplay>

            <SimpleValDisplay label="ROB Tail: ">
              {checkpoint.rob_tail}
            </SimpleValDisplay>

            <SimpleValDisplay label="Pred. Dir: ">
              {checkpoint.predicted_direction ? "T" : "NT"}
            </SimpleValDisplay>

            <SimpleValDisplay label="Pred. Tgt: ">
              {displayValueHex(checkpoint.predicted_target)}
            </SimpleValDisplay>

            <SimpleValDisplay label="Resolved Dir: ">
              {checkpoint.resolving_branch_direction ? "T" : "NT"}
            </SimpleValDisplay>
          </div>
          {/* Toggle Button */}
          <DButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 ml-2"
          >
            {isCollapsed ? "Show ChckPt" : "Hide ChckPt"}
          </DButton>
        </div>

        {/* Collapsible Section */}
        {!isCollapsed && (
          <div className="flex space-x-2 mt-2">
            <DisplayFrizzyList
              className=""
              freeList={checkpoint.frizzy_checkpoint.free}
              readyBits={checkpoint.frizzy_checkpoint.ready}
            />
            <DisplayMapTable
              className=""
              mapTable={checkpoint.map_checkpoint}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const BSDebugger: React.FC<BSDebuggerProps> = ({ className, signalBS }) => {
  // branch stacks / internals
  const branch_stacks = extractSignalValue(signalBS, "branch_stacks").value;
  const BS_branch_stacks = parseCHECKPOINT_DATA_List(branch_stacks);

  const bmask_current = parseBoolArrToString(
    extractSignalValue(signalBS, "bmask_current").value
  );

  const taken_predict_bits = parseBoolArrToString(
    extractSignalValue(signalBS, "taken_predict_bits").value
  );

  // inputs
  // const branch_mask_in = parseBoolArrToString(
  //   extractSignalValue(signalBS, "branch_mask_in").value
  // );

  const correct_branch_data = extractSignalValue(
    signalBS,
    "correct_branch_data"
  ).value;
  const BS_correct_branch_data = parseFU_TO_BS_DATA(correct_branch_data);

  const dispatch_valid = Boolean(
    extractSignalValueToInt(signalBS, "dispatch_valid")
  );

  const checkpoint_in = extractSignalValue(signalBS, "checkpoint_in").value;
  const BS_checkpoint_in = parseCHECKPOINT_DATA(checkpoint_in);

  const cdb = extractSignalValue(signalBS, "cdb").value;
  const BS_cdb = parseCDBTags(cdb);

  const T_old = extractSignalValueToInt(signalBS, "T_old");

  // outputs
  const prediction = extractSignalValueToInt(
    signalBS,
    "prediction"
  ) as Types.BRANCH_PREDICT_T;

  const branch_mask_prev_out = parseBoolArrToString(
    extractSignalValue(signalBS, "branch_mask_prev_out").value
  );
  const branch_mask_reg_out = parseBoolArrToString(
    extractSignalValue(signalBS, "branch_mask_reg_out").value
  );
  const b_mask_mask = parseBoolArrToString(
    extractSignalValue(signalBS, "b_mask_mask").value
  );

  const checkpoint_out = extractSignalValue(signalBS, "checkpoint_out").value;
  const BS_checkpoint_out = parseCHECKPOINT_DATA(checkpoint_out);

  const full = Boolean(extractSignalValueToInt(signalBS, "full"));

  const [showBSInputs, setShowBSInputs] = useState(true);
  const [showBSOutputs, setShowBSOutputs] = useState(true);

  return (
    <Module className={className}>
      {/* HEADER */}
      <ModuleHeader
        label="Branch Stacks"
        parentClassName="flex-col"
        afterClassName="flex-none"
      >
        <div className="flex items-center">
          <div className="space-y-[-.35rem]">
            <SimpleValDisplay label="BMask Current: ">
              {bmask_current}
            </SimpleValDisplay>

            <SimpleValDisplay label="Taken Predict Bits: ">
              {taken_predict_bits}
            </SimpleValDisplay>
          </div>

          {/* Toggle buttons */}
          <div className="pl-3 space-x-2">
            <DButton onClick={() => setShowBSInputs(!showBSInputs)}>
              {showBSInputs ? "Hide BS Inputs" : "Show BS Inputs"}
            </DButton>
            <DButton onClick={() => setShowBSOutputs(!showBSOutputs)}>
              {showBSOutputs ? "Hide BS Outputs" : "Show BS Outputs"}
            </DButton>
          </div>
        </div>
      </ModuleHeader>

      <ModuleContent>
        {/* display inputs */}
        {showBSInputs && (
          <>
            <Card className="mt-2 flex">
              <div className="justify-items-center space-y-1">
                <DisplayFU_TO_BS_DATA
                  className=""
                  data={BS_correct_branch_data}
                />

                <SimpleValDisplay label="T_old: ">{T_old}</SimpleValDisplay>
                <DisplaySingleCheckpoint
                  checkpoint={BS_checkpoint_in}
                  valid={dispatch_valid}
                />
              </div>
              <DisplayCDBData className="" CDBTags={BS_cdb} isEarlyCDB={true} />
            </Card>
          </>
        )}

        {/* BRANCH STACKS */}
        <Card className="mt-2">
          <div className="p-1 grid grid-cols-2 gap-x-2 gap-y-2">
            {BS_branch_stacks.map((cp, idx) => {
              return (
                <div key={idx} className="">
                  <DisplaySingleCheckpoint
                    className=""
                    checkpoint={cp}
                    idx={idx}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* display outputs */}
        {showBSOutputs && (
          <Card className="mt-3">
            <div className="flex space-x-3">
              <div>
                <SimpleValDisplay
                  label="Prediction: "
                  className={`p-1 ${
                    prediction == Types.BRANCH_PREDICT_T.CORRECT_PRED
                      ? "rounded-lg bg-veryGood"
                      : prediction == Types.BRANCH_PREDICT_T.MISPREDICT
                      ? "rounded-lg bg-veryBad"
                      : ""
                  }`}
                  labelClassName="text-base"
                >
                  {Types.getBranchPredictName(prediction)}
                </SimpleValDisplay>

                <div className="pl-1">
                  <SimpleValDisplay
                    label="BMASK prev out: "
                    labelClassName="text-base"
                  >
                    {branch_mask_prev_out}
                  </SimpleValDisplay>

                  <SimpleValDisplay
                    label="BMASK reg out: "
                    labelClassName="text-base"
                  >
                    {branch_mask_reg_out}
                  </SimpleValDisplay>

                  <SimpleValDisplay
                    label="BMASK mask: "
                    labelClassName="text-base"
                  >
                    {b_mask_mask}
                  </SimpleValDisplay>

                  <SimpleValDisplay label="Full: " labelClassName="text-base">
                    {full ? "True" : "False"}
                  </SimpleValDisplay>
                </div>
              </div>
              <DisplaySingleCheckpoint
                className=""
                checkpoint={BS_checkpoint_out}
              />
            </div>
          </Card>
        )}
      </ModuleContent>
    </Module>
  );
};

export default BSDebugger;
