import React, { useState } from "react";
import { ScopeData } from "@/lib/tstypes";
import {
  extractSignalValue,
  parseID_EX_PACKET_List,
  parseBoolArrToBoolArray,
  extractSignalValueToInt,
} from "@/lib/utils";
import DisplayInstList from "./DisplayInstList";
import { Toggle } from "./ui/toggle";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import { Card } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";

type IBDebuggerProps = {
  className: string;
  signalIB: ScopeData;
  signalFront_End: ScopeData;
};

const IBDebugger: React.FC<IBDebuggerProps> = ({
  className,
  signalIB,
  signalFront_End,
}) => {
  // buffer
  const buffer = extractSignalValue(signalIB, "buffer").value;
  const IB_buffer = parseID_EX_PACKET_List(buffer);

  const valid = extractSignalValue(signalIB, "valid").value;
  const IB_valid = parseBoolArrToBoolArray(valid);

  const head = extractSignalValueToInt(signalIB, "head");
  const tail = extractSignalValueToInt(signalIB, "tail");

  // inputs
  const num_dispatched = extractSignalValueToInt(signalIB, "num_dispatched");
  const num_fetched = extractSignalValueToInt(signalIB, "num_fetched");

  const input_id_ex_packet = extractSignalValue(
    signalIB,
    "input_id_ex_packet"
  ).value;
  const IB_input_id_ex_packet = parseID_EX_PACKET_List(input_id_ex_packet);

  // outputs
  const output_id_ex_packet = extractSignalValue(
    signalIB,
    "output_id_ex_packet"
  ).value;
  // const IB_output_id_ex_packet = parseID_EX_PACKET_List(output_id_ex_packet);

  const if_id_reg = extractSignalValue(signalFront_End, "if_id_reg").value;
  const CPU_if_id_reg = parseID_EX_PACKET_List(if_id_reg);

  const [showIBInputs, setShowIBInputs] = useState(true);

  return (
    <>
      <Module className={className}>
        <ModuleHeader label="Inst Buffer">
          {/* small button to enable IBInputs, show only down or up arrow */}
          <Toggle
            pressed={showIBInputs}
            onPressedChange={() => setShowIBInputs(!showIBInputs)}
            className="ml-2"
          >
            {showIBInputs ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </Toggle>
        </ModuleHeader>

        <ModuleContent>
          <div className="justify-items-center space-y-2">
            {/* inputs */}
            {showIBInputs && (
              <div>
                <SimpleValDisplay
                  label="# Dispatched: "
                  labelClassName="text-md"
                >
                  {num_dispatched}
                </SimpleValDisplay>

                <SimpleValDisplay label="# Fetched: " labelClassName="text-md">
                  {num_fetched}
                </SimpleValDisplay>
              </div>
            )}

            <Card className="space-y-2">
              <div className="justify-items-center">
                <p className="font-semibold">From Fetch</p>
                <DisplayInstList
                  className=""
                  instList={IB_input_id_ex_packet}
                  head={-1}
                  tail={-1}
                  isIB={false}
                />
              </div>

              {/* actual buffer */}
              <DisplayInstList
                className=""
                instList={IB_buffer}
                validList={IB_valid}
                head={head}
                tail={tail}
                isIB={true}
              />

              {/* outputs */}
              <div className="justify-items-center">
                <p className="font-semibold">Dispatched</p>
                <DisplayInstList
                  className=""
                  instList={CPU_if_id_reg}
                  head={-1}
                  tail={-1}
                  isIB={false}
                />
              </div>
            </Card>
          </div>
        </ModuleContent>
      </Module>
    </>
  );
};

export default IBDebugger;
