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
import { reverseStr } from "@/lib/tsutils";

type IBDebuggerProps = {
  className: string;
  signalIB: ScopeData;
  signalCPU: ScopeData;
};

const IBDebugger: React.FC<IBDebuggerProps> = ({
  className,
  signalIB,
  signalCPU,
}) => {
  // buffer
  const buffer = extractSignalValue(signalIB, "buffer").value;
  const IB_buffer = parseID_EX_PACKET_List(buffer);

  const valid = reverseStr(extractSignalValue(signalIB, "valid").value);
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
  const IB_output_id_ex_packet = parseID_EX_PACKET_List(output_id_ex_packet);

  const if_id_reg = extractSignalValue(signalCPU, "if_id_reg").value;
  const CPU_if_id_reg = parseID_EX_PACKET_List(if_id_reg);

  const [showIBInputs, setShowIBInputs] = useState(true);

  return (
    <>
      <div className={`${className}`}>
        <div className="bg-gray-500/[.15] rounded-lg shadow-lg p-2 inline-flex flex-col items-center">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold">Inst Buffer</h2>
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
          </div>
          <div className="justify-items-center space-y-2">
            {/* inputs */}
            {showIBInputs && (
              <div>
                <div className="text-md">
                  <span className="font-semibold"># Dispatched: </span>
                  {num_dispatched}
                </div>
                <div className="text-md">
                  <span className="font-semibold"># Fetched: </span>
                  {num_fetched}
                </div>
              </div>
            )}
            <div>
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
            <div className="justify-items-center font-semibold">
              <p>Dispatched</p>
              <DisplayInstList
                className=""
                instList={CPU_if_id_reg}
                head={-1}
                tail={-1}
                isIB={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IBDebugger;
