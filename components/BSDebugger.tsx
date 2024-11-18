import React, { useState } from "react";
import { ScopeData } from "@/lib/tstypes";
import {
  extractSignalValue,
  extractSignalValueToInt,
  parseBoolArrToString,
  parseCDBTags,
  parseCHECKPOINT_DATA,
  parseCHECKPOINT_DATA_List,
} from "@/lib/utils";
import { ModuleBase, ModuleHeader } from "./dui/Module";
import * as Types from "@/lib/types";
import DisplayFrizzyList from "./DisplayFrizzyList";
import DisplayMapTable from "./DisplayMapTable";
import DisplayCDBData from "./DisplayCDBData";
import { DButton } from "./dui/DButton";

interface BSDebuggerProps {
  className: string;
  signalBS: ScopeData;
}

const DisplaySingleCheckpoint: React.FC<{
  className: string;
  checkpoint: Types.CHECKPOINT_DATA;
  idx?: number;
  valid?: boolean;
}> = ({ className, checkpoint, idx, valid }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Define background color based on validity
  const backgroundColor =
    valid !== undefined ? (valid ? "bg-good" : "bg-bad") : "bg-neutral";

  return (
    <div className={`${className}`}>
      <div className={`p-2 pb-0 rounded-lg border ${backgroundColor}`}>
        {idx !== undefined && (
          <h2 className="text-md font-semibold text-center">Stack #{idx}</h2>
        )}
        <div className="flex items-center">
          <div>
            <div>PC: {checkpoint.pc_checkpoint}</div>
            <div>BHR: {checkpoint.bhr_checkpoint}</div>
            <div>ROB Tail: {checkpoint.rob_tail}</div>
          </div>
          {/* Toggle Button */}
          <DButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-10 ml-2"
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
  const branch_mask_in = parseBoolArrToString(
    extractSignalValue(signalBS, "branch_mask_in").value
  );

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
  const [showBS, setShowBS] = useState(true);

  return (
    <ModuleBase className={className}>
      {/* HEADER */}
      <div className="flex items-center">
        <div>
          <ModuleHeader onClick={() => setShowBS(!showBS)}>
            Branch Stacks
          </ModuleHeader>
          <div>
            <span className="font-semibold">BMask Current: </span>
            {bmask_current}
          </div>
          <div>
            <span className="font-semibold">Taken Predict Bits: </span>
            {taken_predict_bits}
          </div>
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

      {showBS && (
        <>
          {/* display inputs */}
          {showBSInputs && (
            <>
              <div className="bg-card-foreground p-2 rounded-lg shadow-lg mt-2">
                <div className="flex space-x-3 items-center">
                  <div>
                    <div>
                      <span className="font-bold">BMASK in: </span>
                      {branch_mask_in}
                    </div>
                    <div>
                      <span className="font-bold">T_old: </span>
                      {T_old}
                    </div>
                  </div>
                  <DisplayCDBData
                    className=""
                    CDBTags={BS_cdb}
                    isEarlyCDB={true}
                  />
                </div>
                <DisplaySingleCheckpoint
                  className="mt-2"
                  checkpoint={BS_checkpoint_in}
                  valid={dispatch_valid}
                />
              </div>
            </>
          )}

          {/* BRANCH STACKS */}
          <div className="mt-2 bg-card-foreground p-2 rounded-lg shadow-lg">
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-2">
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
          </div>

          {/* display outputs */}
          {showBSOutputs && (
            <>
              <div className="mt-3 bg-card-foreground p-2 rounded-lg shadow-lg">
                <div className="flex space-x-3">
                  <div>
                    <div
                      className={`p-1 ${
                        prediction == Types.BRANCH_PREDICT_T.CORRECTLY_PREDICTED
                          ? "rounded-lg bg-veryGood"
                          : prediction == Types.BRANCH_PREDICT_T.MISPREDICTED
                          ? "rounded-lg bg-veryBad"
                          : ""
                      }`}
                    >
                      <span className="font-bold">Prediction: </span>
                      {Types.getBranchPredictName(prediction)}
                    </div>
                    <div>
                      <span className="font-bold">BMASK prev out: </span>
                      {branch_mask_prev_out}
                    </div>
                    <div>
                      <span className="font-bold">BMASK reg out: </span>
                      {branch_mask_reg_out}
                    </div>
                    <div>
                      <span className="font-bold">BMASK mask: </span>
                      {b_mask_mask}
                    </div>
                    <div>
                      <span className="font-bold">Full: </span>
                      {full ? "True" : "False"}
                    </div>
                  </div>
                  <DisplaySingleCheckpoint
                    className=""
                    checkpoint={BS_checkpoint_out}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </ModuleBase>
  );
};

export default BSDebugger;
