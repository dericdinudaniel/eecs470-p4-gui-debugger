import React, { useState } from "react";
import DisplaySingleSignal from "./DisplaySingleSignal";
import { ScopeData } from "@/lib/tstypes";
import { Module, ModuleContent, ModuleHeader } from "./dui/Module";
import { Button } from "./ui/button";

type SignalDebuggerProps = {
  className: string;
  signalData: ScopeData;
};

const SignalDebugger: React.FC<SignalDebuggerProps> = ({
  className,
  signalData,
}) => {
  const [signalCount, setSignalCount] = useState(1);

  const handleAddSignal = () => setSignalCount((prev) => prev + 1);
  const handleRemoveSignal = () =>
    setSignalCount((prev) => (prev >= 1 ? prev - 1 : prev));
  const handleSetSignalCount = (value: number) => {
    if (value >= 0) setSignalCount(value);
  };

  return (
    <Module className={`block ${className}`}>
      <ModuleHeader className="mb-1" label="Signal Debugger" />
      <ModuleContent className="justify-items-start">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRemoveSignal}
            className="p-2 bg-red-500 text-white rounded-md"
          >
            -1
          </Button>
          <input
            type="number"
            value={signalCount}
            onChange={(e) =>
              handleSetSignalCount(parseInt(e.target.value, 10) || 1)
            }
            className="w-16 p-2 border rounded-md text-center text-sm"
            min={0}
          />
          <Button
            onClick={handleAddSignal}
            className="p-2 bg-green-500 text-white rounded-md"
          >
            +1
          </Button>
        </div>

        <div className="grid gap-2 mt-3">
          {Array.from({ length: signalCount }).map((_, index) => (
            <DisplaySingleSignal
              key={index}
              className=""
              signalData={signalData}
            />
          ))}
        </div>
      </ModuleContent>
    </Module>
  );
};

export default SignalDebugger;
