// components/DebuggerHeader.tsx

import React, { useState, useEffect } from "react";

interface DebuggerHeaderProps {
  currentCycle: number;
  isNegativeEdge: boolean;
  includeNegativeEdges: boolean;
  setIncludeNegativeEdges: (value: boolean) => void;
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

function padWithSpaces(number: number, maxNumber: number): JSX.Element {
  const maxDigits = String(maxNumber).length;
  const currentDigits = String(number).length;
  const paddingNeeded = maxDigits - currentDigits;
  const padding = Array(paddingNeeded).fill("\u00A0");
  return (
    <span>
      {padding.join("")}
      {number}
    </span>
  );
}

interface DebuggerButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  shortcutKey: string;
}

const DebuggerButton: React.FC<DebuggerButtonProps> = ({
  onClick,
  children,
  shortcutKey,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === shortcutKey) {
        setIsPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === shortcutKey) {
        setIsPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [shortcutKey]);

  return (
    <button
      onClick={onClick}
      className={`debugger-cycle-btn ${isPressed ? "bg-blue-900" : ""}`}
    >
      <span className="underline-fade text-white">{children}</span>
    </button>
  );
};

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="justify-items-center">
        <span className="ml-2 text-sm text-gray-700">Include Negedges (t)</span>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div
            className={`w-12 h-5 bg-gray-300 rounded-full transition-colors duration-200 ease-in-out ${
              checked ? "bg-blue-600" : ""
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                checked ? "transform translate-x-7" : ""
              }`}
            />
          </div>
        </div>
      </div>
    </label>
  );
};

const DebuggerHeader: React.FC<DebuggerHeaderProps> = ({
  currentCycle,
  isNegativeEdge,
  includeNegativeEdges,
  setIncludeNegativeEdges,
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
          <h1 className="text-2xl font-bold pr-6">Verilog Debugger</h1>

          <a href="/" className="text-blue-500 underline-fade pr-0">
            ← Back to Home
          </a>

          <div className="w-56 font-semibold">
            <p className="text-right font-mono">
              Current Cycle: {padWithSpaces(currentCycle, maxCycle)}
              {isNegativeEdge ? "/neg" : "/pos"}
            </p>
            <p className="text-right font-mono">
              Num Cycles: {padWithSpaces(maxCycle + 1, maxCycle)}
            </p>
          </div>

          <div className="flex space-x-2 pl-4 items-center">
            <DebuggerButton onClick={handleStart} shortcutKey="v">
              Start (v)
            </DebuggerButton>
            <DebuggerButton onClick={handlePreviousCycle} shortcutKey="b">
              Previous Cycle (b)
            </DebuggerButton>
            <DebuggerButton onClick={handleNextCycle} shortcutKey="n">
              Next Cycle (n)
            </DebuggerButton>
            <DebuggerButton onClick={handleEnd} shortcutKey="m">
              End (m)
            </DebuggerButton>
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
              <DebuggerButton onClick={handleJumpToCycle} shortcutKey="j">
                Jump to Cycle (j)
              </DebuggerButton>
            </div>
            <div className="ml-4">
              <ToggleSwitch
                checked={includeNegativeEdges}
                onChange={setIncludeNegativeEdges}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DebuggerHeader;
