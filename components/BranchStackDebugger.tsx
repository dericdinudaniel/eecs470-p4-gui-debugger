import React from "react";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";
import { extractSignalValue, parseCHECKPOINT_DATA_List } from "@/lib/utils";
import DisplayFrizzyList from "./DisplayFrizzyList";

interface BranchStackDebuggerProps {
  className: string;
  signalBS: ScopeData;
}

const BranchStackDebugger: React.FC<BranchStackDebuggerProps> = ({
  className,
  signalBS,
}) => {
  const branch_stacks = extractSignalValue(signalBS, "branch_stacks").value;
  const BS_branch_stacks = parseCHECKPOINT_DATA_List(branch_stacks);

  console.log(BS_branch_stacks);

  return (
    <>
      <div className="p-4">test</div>
      <div className="flex">
        {BS_branch_stacks.map((checkpoint, idx) => {
          console.log(checkpoint);
          return (
            <>
              <div key={idx}></div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default BranchStackDebugger;
