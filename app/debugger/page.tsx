"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DebuggerOutput from "@/components/DebuggerOutput";
import ROBDebugger from "@/components/ROBDebugger";

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
          handleBeginning();
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

  const handleBeginning = () => {
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* home button */}
      <div className="mb-8">
        <a href="/" className="text-blue-500 underline-fade">
          ← Back to Home
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Verilog Debugger</h1>
        <div className="mb-4">
          <p>Current Cycle: {currentCycle}</p>
          <p>Num Cycles: {maxCycle + 1}</p>
        </div>
        <div className="flex space-x-2 mb-4">
          <button onClick={handleBeginning} className="debugger-cycle-btn">
            Beginning (v)
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
        </div>
        <div className="flex space-x-2">
          <input
            id="jumpCycleInput"
            type="number"
            value={jumpCycle}
            onChange={(e) => setJumpCycle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border rounded px-2 py-1"
            placeholder="Cycle number"
          />
          <button onClick={handleJumpToCycle} className="debugger-cycle-btn">
            Jump to Cycle (j)
          </button>
        </div>

        {signalData && (
          <>
            <ROBDebugger
              className=""
              // always pass in direct access to ROB
              signalData={signalData?.signals.children.testbench.children.DUT}
            />
            {/* <DebuggerOutput signalData={signalData} /> */}
          </>
        )}
      </div>
    </div>
  );
}
