import React from "react";

interface DebuggerHeaderProps {
  currentCycle: number;
  maxCycle: number;
  jumpCycle: string;
  setJumpCycle: (value: string) => void;
  handleStart: () => void;
  handlePreviousCycle: () => void;
  handleNextCycle: () => void;
  handleEnd: () => void;
  handleJumpToCycle: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const DebuggerHeader: React.FC<DebuggerHeaderProps> = ({
  currentCycle,
  maxCycle,
  jumpCycle,
  setJumpCycle,
  handleStart,
  handlePreviousCycle,
  handleNextCycle,
  handleEnd,
  handleJumpToCycle,
  handleKeyDown,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex space-x-2 mb-4 items-center">
          <div className="">
            <p>Current Cycle: {currentCycle}</p>
            <p>Num Cycles: {maxCycle + 1}</p>
          </div>
          <button onClick={handleStart} className="debugger-cycle-btn">
            Start (v)
          </button>
          <button onClick={handlePreviousCycle} className="debugger-cycle-btn">
            Previous Cycle (b)
          </button>
          <button onClick={handleNextCycle} className="debugger-cycle-btn">
            Next Cycle (n)
          </button>
          <button onClick={handleEnd} className="debugger-cycle-btn">
            End (m)
          </button>
          <div className="flex space-x-2">
            <input
              id="jumpCycleInput"
              type="number"
              value={jumpCycle}
              onChange={(e) => setJumpCycle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border rounded text-right py-1 w-20 text-xs"
              placeholder="Cycle #"
            />
            <button onClick={handleJumpToCycle} className="debugger-cycle-btn">
              Jump to Cycle (j)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebuggerHeader;
