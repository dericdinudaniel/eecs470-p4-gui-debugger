import React, { useState } from "react";
import {
  extractSignalValue,
  extractSignalValueToInt,
  parseROBData,
  parseCDBTags,
} from "@/lib/utils";
import { ScopeData } from "@/lib/tstypes";
import DisplayROBData from "./DisplayROBData";
import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import { DButton } from "./dui/DButton";
import { Card } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";

type ROBDebuggerProps = {
  className: string;
  signalData: ScopeData;
};

const ROBDebugger: React.FC<ROBDebuggerProps> = ({ className, signalData }) => {
  // input signals
  const dispatched_ins = extractSignalValue(signalData, "dispatched_ins").value;
  const ROB_dispatched_ins = parseROBData(dispatched_ins);
  const cdb = extractSignalValue(signalData, "rob_completed").value;
  const ROB_cdb = parseCDBTags(cdb);

  // internal signals
  const reset = extractSignalValueToInt(signalData, "reset");
  const head = extractSignalValueToInt(signalData, "head");
  const tail = extractSignalValueToInt(signalData, "tail");
  const available_spots = extractSignalValueToInt(
    signalData,
    "available_spots"
  );
  // pure internal signals
  // const head_growth = extractSignalValueToInt(signalData, "head_growth");
  // const tail_growth = extractSignalValueToInt(signalData, "tail_growth");
  const next_direction = extractSignalValueToInt(signalData, "next_direction");
  const last_direction = extractSignalValueToInt(signalData, "last_direction");
  const empty = extractSignalValueToInt(signalData, "empty");
  const retireable_cnt = extractSignalValueToInt(signalData, "retireable_cnt");

  // entries
  const entries = extractSignalValue(signalData, "entries").value;
  const ROB_entries = parseROBData(entries);

  // output signals
  const open_spots = extractSignalValueToInt(signalData, "open_spots");

  // State to control visibility of stuff
  const [showROBInternals, setShowROBInternals] = useState(false);
  const [showROBInputs, setShowROBInputs] = useState(true);

  return (
    <>
      <Module className={className}>
        <ModuleHeader label="ROB">
          <p className="pl-3">
            <span className="font-semibold">(Open Spots: </span>
            {Number.isNaN(open_spots) ? "X" : open_spots})
          </p>

          {/* Toggle buttons */}
          <div className="pl-3 space-x-2">
            <DButton onClick={() => setShowROBInputs(!showROBInputs)}>
              {showROBInputs ? "Hide ROB Inputs" : "Show ROB Inputs"}
            </DButton>
            <DButton onClick={() => setShowROBInternals(!showROBInternals)}>
              {showROBInternals ? "Hide ROB Internals" : "Show ROB Internals"}
            </DButton>
          </div>
        </ModuleHeader>

        <ModuleContent className="space-y-2 ">
          {/* display inputs */}
          {showROBInputs && (
            <Card>
              <p className="font-semibold">Dispatched Instructions</p>
              <DisplayROBData
                className="shadow-none p-0"
                ROBData={ROB_dispatched_ins}
                head={-1}
                tail={-1}
                isROB={false}
              />
            </Card>
          )}

          {/* display ROB internals */}
          {showROBInternals && (
            <Card className="flex space-x-4">
              <div>
                <SimpleValDisplay label="Available Spots: ">
                  {available_spots}
                </SimpleValDisplay>

                <SimpleValDisplay label="Retireable Count: ">
                  {retireable_cnt}
                </SimpleValDisplay>
              </div>

              <SimpleValDisplay label="Empty: ">{empty}</SimpleValDisplay>

              <div>
                <SimpleValDisplay label="Next Dir: ">
                  {next_direction ? "SHRK" : "GROW"}
                </SimpleValDisplay>

                <SimpleValDisplay label="Last Dir: ">
                  {last_direction ? "SHRK" : "GROW"}
                </SimpleValDisplay>
              </div>
            </Card>
          )}

          {/* display ROB entries */}
          <DisplayROBData
            className=""
            ROBData={ROB_entries}
            head={head}
            tail={tail}
            isROB={true}
          />

          {/* output signals */}
        </ModuleContent>
      </Module>
    </>
  );
};

export default ROBDebugger;
