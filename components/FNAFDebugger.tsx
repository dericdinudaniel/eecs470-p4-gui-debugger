import React from "react";
import { SignalType, SignalData, ScopeData } from "@/lib/tstypes";

type FNAFDebuggerProps = {
  className: string;
  signalFrizzy: ScopeData;
};

const FNAFDebugger: React.FC<FNAFDebuggerProps> = ({
  className,
  signalFrizzy,
}) => {
  return (
    <>
      <div>Frizzy</div>
    </>
  );
};

export default FNAFDebugger;
