import React from "react";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";
import { extractSignalValue } from "@/lib/utils";

interface BranchStackDebuggerProps {
  className: string;
  signalBS: ScopeData;
}

const BranchStackDebugger: React.FC<BranchStackDebuggerProps> = ({
  className,
  signalBS,
}) => {
  const branch_stacks = extractSignalValue(signalBS, "branch_stacks").value;

  return (
    <>
      <div className="p-4"></div>
    </>
  );
};

export default BranchStackDebugger;
