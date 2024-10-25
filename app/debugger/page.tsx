"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DebuggerOutput from "@/components/DebuggerOutput";
import ROBDebugger from "@/components/ROBDebugger";
import DebuggerHeader from "@/components/DebuggerHeader";

export default function Debugger() {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [maxCycle, setMaxCycle] = useState(0);
  const [jumpCycle, setJumpCycle] = useState("");
  const [headerInfo, setHeaderInfo] = useState<any>(null);
  const [signalData, setSignalData] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "n":
          handleNextCycle();
          break;
        case "b":
          handlePreviousCycle();
          break;
        case "v":
          handleStart();
          break;
        case "m":
          handleEnd();
          break;
        case "j":
          // Focus on the jump to cycle input
          document.getElementById("jumpCycleInput")?.focus();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentCycle, maxCycle]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJumpToCycle();
    }
  };

  const fetchSignalData = async (cycle: number) => {
    try {
      const response = await fetch(`/api/get_signals/${cycle}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch signal data");
      }
      const data = await response.json();
      setSignalData(data);
    } catch (error) {
      console.error("Error fetching signal data:", error);
    }
  };

  useEffect(() => {
    const headerInfoParam = searchParams.get("headerInfo");
    if (headerInfoParam) {
      const parsedHeaderInfo = JSON.parse(headerInfoParam);
      setHeaderInfo(parsedHeaderInfo);
      setMaxCycle(parsedHeaderInfo.num_cycles - 1 || 0);
    }

    fetchSignalData(0);
  }, [searchParams]);

  const handleNextCycle = () => {
    setCurrentCycle((prev) => Math.min(prev + 1, maxCycle));
    fetchSignalData(Math.min(currentCycle + 1, maxCycle));
  };

  const handlePreviousCycle = () => {
    setCurrentCycle((prev) => Math.max(prev - 1, 0));
    fetchSignalData(Math.max(currentCycle - 1, 0));
  };

  const handleStart = () => {
    setCurrentCycle(0);
    fetchSignalData(0);
  };
  const handleEnd = () => {
    setCurrentCycle(maxCycle);
    fetchSignalData(maxCycle);
  };

  const handleJumpToCycle = () => {
    var cycle = parseInt(jumpCycle);
    if (!isNaN(cycle)) {
      cycle = Math.max(0, Math.min(cycle, maxCycle));
      setCurrentCycle(cycle);
      setJumpCycle("");
      fetchSignalData(cycle);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 p-0">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-2 mb-4 items-center">
          {/* title */}
          <h1 className="text-2xl font-bold pr-6">Verilog Debugger</h1>

          {/* back to home */}
          <a href="/" className="text-blue-500 underline-fade pr-0">
            ← Back to Home
          </a>

          {/* buttons */}
          <div className="w-44">
            <p className="text-right font-mono">
              Current Cycle: {padWithSpaces(currentCycle, maxCycle)}
            </p>
            <p className="text-right font-mono">
              Num Cycles: {padWithSpaces(maxCycle + 1, maxCycle)}
            </p>
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

        {signalData && (
          <>
            <ROBDebugger
              className=""
              // always pass in direct access to ROB
              signalData={signalData?.signals.children.testbench.children.DUT}
            />
            <DebuggerOutput signalData={signalData} />
          </>
        )}
      </div>
    </div>
  );
}
