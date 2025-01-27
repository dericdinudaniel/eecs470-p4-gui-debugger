"use client";

import React from "react";
import SignalDebugger from "@/components/SignalDebugger";
import DebuggerOutput from "@/components/DebuggerOutput";
import IFDebugger from "./IFDebugger";
import IDDebugger from "./IDDebugger";
import EXDebugger from "./EXDebugger";
import MEMDebugger from "./MEMDebugger";
import WBDebugger from "./WBDebugger";
import RegfileDebugger from "./RegfileDebugger";

type DisplayAllP3Props = {
  className: string;
  signalData: any;
};

const DisplayAllP3: React.FC<DisplayAllP3Props> = ({
  className,
  signalData,
}) => {
  const testbench = signalData?.signals.children.testbench;
  const cpu = testbench?.children.verisimpleV;

  const stage_if = cpu?.children.stage_if_0;
  const stage_id = cpu?.children.stage_id_0;
  const stage_ex = cpu?.children.stage_ex_0;
  const stage_mem = cpu?.children.stage_mem_0;
  const stage_wb = cpu?.children.stage_wb_0;

  const regfile = stage_id?.children.regfile_0;

  return (
    <>
      <>
        <div className="space-y-4">
          <div className="flex gap-x-2">
            <IFDebugger className="" signalIF={stage_if} />
            <IDDebugger className="" signalID={stage_id} />
            <EXDebugger className="" signalEX={stage_ex} />
            <MEMDebugger className="" signalMEM={stage_mem} />
            <WBDebugger className="" signalWB={stage_wb} />
            <RegfileDebugger className="" signalReg={regfile} />
          </div>
          <div></div>
        </div>

        {/* all signals */}
        <div className="space-y-4">
          <SignalDebugger className="" signalData={testbench.children} />
          <DebuggerOutput className="" signalData={signalData} />
        </div>
      </>
    </>
  );
};

export default DisplayAllP3;
