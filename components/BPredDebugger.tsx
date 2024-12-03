import React, { useState } from "react";
import { ScopeData } from "@/lib/tstypes";
import * as Types from "@/lib/types";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToBool,
  extractSignalValueToInt,
  parsePREDICTOR_STATE_T_List,
} from "@/lib/utils";
import { ModuleBase, ModuleHeader } from "./dui/Module";
import { chunkArray } from "@/lib/tsutils";
import { Dtable, Dtbody, Dtd, DtdLeft, Dth, Dthead, Dtr } from "./dui/DTable";
import { DButton } from "./dui/DButton";

const DisplayPHT: React.FC<{
  className: string;
  phtList: Types.PREDICTOR_STATE_T[];
}> = ({ className, phtList }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const chunkSize = 64;
  const phtChunks = chunkArray(phtList, chunkSize);

  return (
    <>
      <div className={className}>
        <div className="justify-items-center">
          <div>
            <DButton onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? "Hide PHT" : "Show PHT"}
            </DButton>
          </div>
          {isCollapsed && (
            <div className="mt-1 flex space-x-1">
              {phtChunks.map((chunk, chunkIdx) => (
                <Dtable key={chunkIdx}>
                  <Dthead>
                    <Dtr>
                      <Dth className="p-1">#</Dth>
                      <Dth className="p-1">State</Dth>
                    </Dtr>
                  </Dthead>
                  <Dtbody>
                    {chunk.map((phtSingle, idx) => {
                      let color = "bg-neutral";
                      switch (phtSingle) {
                        case Types.PREDICTOR_STATE_T.ST:
                          color = "bg-good";
                          break;
                        case Types.PREDICTOR_STATE_T.WT:
                          color = "bg-goodLight";
                          break;
                        case Types.PREDICTOR_STATE_T.WNT:
                          color = "bg-badLight";
                          break;
                        case Types.PREDICTOR_STATE_T.SNT:
                          color = "bg-bad";
                          break;
                      }

                      return (
                        <Dtr key={chunkIdx * chunkSize + idx}>
                          <DtdLeft className="font-semibold bg-neutral px-1">
                            {chunkIdx * chunkSize + idx}:
                          </DtdLeft>
                          <Dtd className={color}>
                            <div className="text-center">
                              <span>
                                {Types.getPredictorStateName(phtSingle)}
                              </span>
                            </div>
                          </Dtd>
                        </Dtr>
                      );
                    })}
                  </Dtbody>
                </Dtable>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface BPredDebuggerProps {
  className: string;
  signalBP: ScopeData;
}

const BPredDebugger: React.FC<BPredDebuggerProps> = ({
  className,
  signalBP,
}) => {
  // Prediction interface
  // inputs
  const incoming_branch_valid = extractSignalValueToBool(
    signalBP,
    "incoming_branch_valid"
  );
  const incoming_branch_PC = extractSignalValueToInt(
    signalBP,
    "incoming_branch_PC"
  );
  // outputs
  const predicted_direction = extractSignalValueToBool(
    signalBP,
    "predicted_direction"
  );
  const bhr = extractSignalValue(signalBP, "bhr").value;

  //
  // Recovery interface (from branch stack)
  const resolving_branch_direction = extractSignalValueToBool(
    signalBP,
    "resolving_branch_direction"
  );
  const resolving_branch_status = extractSignalValueToInt(
    signalBP,
    "resolving_branch_status"
  ) as Types.BRANCH_PREDICT_T;
  const resolving_branch_PC = extractSignalValueToInt(
    signalBP,
    "resolving_branch_PC"
  );
  const checkpointed_bhr = extractSignalValue(
    signalBP,
    "checkpointed_bhr"
  ).value;

  // PHT
  const pht = extractSignalValue(signalBP, "pht").value;
  const BP_pht = parsePREDICTOR_STATE_T_List(pht);

  const [showBPred, setShowBPred] = useState(true);

  return (
    <>
      <ModuleBase className={className}>
        <div>
          <ModuleHeader onClick={() => setShowBPred(!showBPred)}>
            Branch Predictor
          </ModuleHeader>
        </div>

        {showBPred && (
          <>
            <div
              className={`${
                incoming_branch_valid ? "bg-good" : "bg-bad"
              } rounded-lg p-1 text-sm`}
            >
              <span className="font-semibold">Incoming PC: </span>
              {displayValueHex(incoming_branch_PC)}
            </div>

            {/* recovery interface */}
            <div className="justify-items-center shadow-lg bg-card-foreground rounded-lg p-1 mt-2">
              <h3 className="font-semibold underline">Recovery Interface</h3>
              <div className="">
                <div className="text-sm">
                  <span className="font-semibold">Actual Branch Dir.: </span>
                  {predicted_direction ? "Taken" : "Not Taken"}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Branch Resolution: </span>
                  {Types.getBranchPredictName(resolving_branch_status)}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Resolving PC: </span>
                  {displayValueHex(resolving_branch_PC)}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Checkpointed BHR: </span>
                  {checkpointed_bhr.slice(1)}
                </div>
              </div>
            </div>

            {/* internals (pht is an output but counts as internal) */}
            <div className="mt-2">
              <div>
                <span className="font-semibold">Current BHR: </span>
                {bhr.slice(1)}
              </div>
              <div>
                <DisplayPHT className="" phtList={BP_pht} />
              </div>
            </div>
          </>
        )}
      </ModuleBase>
    </>
  );
};

export default BPredDebugger;
