import React from "react";
import { ScopeData } from "@/lib/tstypes";
import DebuggerOutput from "@/components/DebuggerOutput";
import ROBDebugger from "@/components/ROBDebugger";
import RSDebugger from "@/components/RSDebugger";
import FNAFDebugger from "@/components/FNAFDebugger";
import RegfileDebugger from "@/components/RegfileDebugger";
import ShadDebuggerHeader from "@/components/ShadDebuggerHeader";
import BSDebugger from "@/components/BSDebugger";
import FUDebugger from "@/components/FUDebugger";
import IBDebugger from "@/components/IBDebugger";
import BPredDebugger from "@/components/BPredDebugger";
import SignalDebugger from "@/components/SignalDebugger";
import I$Debugger from "@/components/I$Debugger";
import MemDebugger from "@/components/MemDebugger";
import SQDebugger from "@/components/SQDebugger";
import D$Debugger from "@/components/D$Debugger";

type DisplayAllProps = {
  className: string;
  signalData: any;
};

const DisplayAll: React.FC<DisplayAllProps> = ({ className, signalData }) => {
  const testbench = signalData?.signals.children.testbench;
  const cpu = testbench?.children.mustafa;
  const Front_End = cpu?.children.Front_End;
  const OoO_Core = cpu?.children.OoO_Core;

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-x-2">
          <D$Debugger className="" signalD$={cpu.children.dcache} />
          <I$Debugger
            className=""
            signalI$={Front_End.children.fetcher.children.cacher}
          />
          <SQDebugger className="" signalSQ={OoO_Core.children.DUT_sq} />
        </div>

        <div className="flex gap-x-2">
          <div className="justify-items-center space-y-4">
            <BPredDebugger
              className=""
              signalBP={Front_End.children.masonshare}
            />
            <IBDebugger
              className=""
              signalIB={cpu.children.Front_End.children.instr_buffer}
              signalFront_End={Front_End}
            />
            <RegfileDebugger
              className=""
              signalRegfile={OoO_Core.children.DUT_regfile}
            />
          </div>

          <div className="justify-items-center space-y-4">
            <ROBDebugger className="" signalData={OoO_Core.children.DUT_rob} />
            <MemDebugger
              className=""
              signalCPU={cpu}
              signalMem={testbench.children.memory}
              signalMemArb={cpu.children.mem_arbiter}
            />
            <FNAFDebugger
              className=""
              signalFNAF={OoO_Core.children.DUT_freddy}
            />
          </div>

          <div className="justify-items-center space-y-4">
            <RSDebugger
              className=""
              signalRS={OoO_Core.children.DUT_rs}
              signalSQ={OoO_Core.children.DUT_sq}
            />
            <div className="flex gap-x-2">
              <BSDebugger
                className=""
                signalBS={OoO_Core.children.DUT_branch_stack}
              />
              <FUDebugger className="" signalFU={OoO_Core.children.DUT_fu} />
            </div>
          </div>
        </div>
      </div>

      {/* all signals */}
      <div className="space-y-4">
        <SignalDebugger className="" signalData={testbench.children} />
        <DebuggerOutput className="" signalData={signalData} />
      </div>
    </>
  );
};

export default DisplayAll;
