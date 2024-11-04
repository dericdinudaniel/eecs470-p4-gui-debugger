import React from "react";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";
import { extractSignalValue, parseFreeList } from "@/lib/utils";
import DisplayFreeList from "./DisplayFrizzyList";

type FNAFDebuggerProps = {
  className: string;
  signalFrizzy: ScopeData;
};

const FNAFDebugger: React.FC<FNAFDebuggerProps> = ({
  className,
  signalFrizzy,
}) => {
  const free_list = extractSignalValue(signalFrizzy, "free_list").value;
  const FNAF_free_list = parseFreeList(free_list);

  const ready_bits = extractSignalValue(signalFrizzy, "ready_bits").value;
  const FNAF_ready_bits = parseFreeList(ready_bits);

  return (
    <>
      <div className="p-4">
        <DisplayFreeList
          className=""
          freeList={FNAF_free_list}
          readyBits={FNAF_ready_bits}
        />
      </div>
    </>
  );
};

export default FNAFDebugger;
