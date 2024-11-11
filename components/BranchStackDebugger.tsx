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

  return (
    <>
      <div className={`${className} mt-4`}>
        <div className="bg-gray-500/[.15] rounded-lg shadow-lg p-4 inline-flex flex-col items-center">
          <div className="p-4">test</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            {BS_branch_stacks.map((cp, idx) => {
              return (
                <div key={idx}>
                  <div className="bg-gray-100 p-2 rounded-xl">
                    {cp.rob_tail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchStackDebugger;
