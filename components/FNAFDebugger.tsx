import React from "react";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";
import {
  extractSignalValue,
  parseFree_PR,
  parseFreeList,
  parseReg_Map,
} from "@/lib/utils";
import DisplayFrizzyList from "./DisplayFrizzyList";
import DisplayMapTable from "./DisplayMapTable";

type FNAFDebuggerProps = {
  className: string;
  signalFNAF: ScopeData;
};

const FNAFDebugger: React.FC<FNAFDebuggerProps> = ({
  className,
  signalFNAF,
}) => {
  const signalFrizzy = (signalFNAF?.children as unknown as ScopeData)
    .frizzy_table as unknown as ScopeData;

  const free_list = extractSignalValue(signalFrizzy, "free_list").value;
  const FNAF_free_list = parseFreeList(free_list);

  const ready_bits = extractSignalValue(signalFrizzy, "ready_bits").value;
  const FNAF_ready_bits = parseFreeList(ready_bits);

  //   const free_PR = extractSignalValue(signalFNAF, "free_PR").value;
  //   const FNAF_free_PR = parseFree_PR(free_PR);

  const reg_map = extractSignalValue(signalFNAF, "reg_map").value;
  const FNAF_reg_map = parseReg_Map(reg_map);

  return (
    <>
      <div className="p-4 inline-flex flex-row">
        <div className="space-x-4 bg-gray-200 p-3 rounded-xl shadow-lg">
          <DisplayFrizzyList
            className=""
            freeList={FNAF_free_list}
            readyBits={FNAF_ready_bits}
          />
          <DisplayMapTable
            className=""
            mapTable={FNAF_reg_map}
            readyBits={FNAF_ready_bits}
          />
        </div>
      </div>
    </>
  );
};

export default FNAFDebugger;
