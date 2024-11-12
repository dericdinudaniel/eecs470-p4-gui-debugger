import React from "react";
import { ScopeData } from "@/lib/tstypes";
import {
  extractSignalValue,
  parseID_EX_PACKET_List,
  parseBoolArrToBoolArray,
} from "@/lib/utils";

type InstBufDebuggerProps = {
  className: string;
  signalIB: ScopeData;
};

const InstBufDebugger: React.FC<InstBufDebuggerProps> = ({
  className,
  signalIB,
}) => {
  // buffer
  const buffer = extractSignalValue(signalIB, "buffer").value;
  const IB_buffer = parseID_EX_PACKET_List(buffer);

  const valid = extractSignalValue(signalIB, "valid").value;
  const IB_valid = parseBoolArrToBoolArray(valid);

  // inputs
  const input_id_ex_packet = extractSignalValue(
    signalIB,
    "input_id_ex_packet"
  ).value;
  const IB_input_id_ex_packet = parseID_EX_PACKET_List(input_id_ex_packet);

  const output_id_ex_packet = extractSignalValue(
    signalIB,
    "output_id_ex_packet"
  ).value;
  const IB_output_id_ex_packet = parseID_EX_PACKET_List(output_id_ex_packet);

  return (
    <>
      <div className={`${className} mt-4`}>
        <div className="bg-gray-500/[.15] rounded-lg shadow-lg p-4 inline-flex flex-col items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Inst Buffer</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstBufDebugger;
