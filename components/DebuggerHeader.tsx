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

// Helper function to pad numbers with non-breaking spaces
function padWithSpaces(number: number, maxCycle: number): JSX.Element {
  const maxDigits = String(maxCycle).length;
  const currentDigits = String(number).length;

  // Calculate the number of non-breaking spaces needed for padding
  const paddingNeeded = maxDigits - currentDigits;

  // Generate an array of non-breaking spaces
  const padding = Array(paddingNeeded).fill("\u00A0"); // "\u00A0" is the Unicode for non-breaking space

  // Return the padded number as a JSX element
  return (
    <span>
      {padding.join("")}
      {number}
    </span>
  );
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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-lg">
      <div className="max-w-[2000px] mx-auto px-6 py-2">
        <div className="flex space-x-2 items-center">
          {/* title */}
          <h1 className="text-2xl font-bold pr-6">Verilog Debugger</h1>

          {/* back to home */}
          <a href="/" className="text-blue-500 underline-fade pr-0">
            ← Back to Home
          </a>

          {/* cycle info */}
          <div className="w-44">
            <p className="text-right font-mono">
              Current Cycle: {padWithSpaces(currentCycle, maxCycle)}
            </p>
            <p className="text-right font-mono">
              Num Cycles: {padWithSpaces(maxCycle + 1, maxCycle)}
            </p>
          </div>

          {/* buttons */}
          <div className="flex space-x-2 pl-4">
            <button onClick={handleStart} className="debugger-cycle-btn">
              Start (v)
            </button>
            <button
              onClick={handlePreviousCycle}
              className="debugger-cycle-btn"
            >
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
              <button
                onClick={handleJumpToCycle}
                className="debugger-cycle-btn"
              >
                Jump to Cycle (j)
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DebuggerHeader;
