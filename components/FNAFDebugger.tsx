import React, { useState } from "react";
import { ScopeData } from "@/lib/tstypes";
import { extractSignalValue, parseFreeList, parseReg_Map } from "@/lib/utils";
import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import DisplayFrizzyList from "./DisplayFrizzyList";
import DisplayMapTable from "./DisplayMapTable";
import { Card } from "./dui/Card";

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

  const reg_map = extractSignalValue(signalFNAF, "reg_map").value;
  const FNAF_reg_map = parseReg_Map(reg_map);

  return (
    <>
      <Module className={className}>
        <ModuleHeader label="Freddy" />
        <ModuleContent className="">
          <Card className="flex space-x-3 rounded-xl pt-1">
            <DisplayFrizzyList
              className=""
              freeList={FNAF_free_list}
              readyBits={FNAF_ready_bits}
            />
            <DisplayMapTable className="" mapTable={FNAF_reg_map} />
          </Card>
        </ModuleContent>
      </Module>
    </>
  );
};

export default FNAFDebugger;
