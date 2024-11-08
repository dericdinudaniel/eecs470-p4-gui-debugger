// app/debugger/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DebuggerOutput from "@/components/DebuggerOutput";
import ROBDebugger from "@/components/ROBDebugger";
import DebuggerHeader from "@/components/DebuggerHeader";
import RSDebugger from "@/components/RSDebugger";
import FNAFDebugger from "@/components/FNAFDebugger";
import RegfileDebugger from "@/components/RegfileDebugger";
import { extractSignalValueToInt } from "@/lib/utils";
import ShadDebuggerHeader from "@/components/ShadDebuggerHeader";

export default function Debugger() {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isNegativeEdge, setIsNegativeEdge] = useState(false);
  const [includeNegativeEdges, setIncludeNegativeEdges] = useState(false);
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
          document.getElementById("jumpCycleInput")?.focus();
          break;
        case "t":
          setIncludeNegativeEdges((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentCycle, maxCycle, isNegativeEdge, includeNegativeEdges]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJumpToCycle();
    }
  };

  const fetchSignalData = async (cycle: number, edge: "pos" | "neg") => {
    try {
      const response = await fetch(`/api/get_signals/${cycle}/${edge}`);
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

    fetchSignalData(0, "pos");
  }, [searchParams]);

  const handleNextCycle = () => {
    if (includeNegativeEdges) {
      if (!isNegativeEdge) {
        setIsNegativeEdge(true);
        fetchSignalData(currentCycle, "neg");
      } else {
        setIsNegativeEdge(false);
        setCurrentCycle((prev) => Math.min(prev + 1, maxCycle));
        fetchSignalData(Math.min(currentCycle + 1, maxCycle), "pos");
      }
    } else {
      setCurrentCycle((prev) => Math.min(prev + 1, maxCycle));
      setIsNegativeEdge(false);
      fetchSignalData(Math.min(currentCycle + 1, maxCycle), "pos");
    }
  };

  const handlePreviousCycle = () => {
    if (includeNegativeEdges) {
      if (isNegativeEdge) {
        setIsNegativeEdge(false);
        fetchSignalData(currentCycle, "pos");
      } else if (currentCycle > 0 || (currentCycle === 0 && isNegativeEdge)) {
        setIsNegativeEdge(true);
        setCurrentCycle((prev) => Math.max(prev - 1, -1));
        fetchSignalData(Math.max(currentCycle - 1, -1), "neg");
      }
    } else {
      setCurrentCycle((prev) => Math.max(prev - 1, 0));
      setIsNegativeEdge(false);
      fetchSignalData(Math.max(currentCycle - 1, 0), "pos");
    }
  };

  const handleStart = () => {
    setCurrentCycle(0);
    setIsNegativeEdge(false);
    fetchSignalData(0, "pos");
  };

  const handleEnd = () => {
    setCurrentCycle(maxCycle);
    setIsNegativeEdge(includeNegativeEdges);
    fetchSignalData(maxCycle, includeNegativeEdges ? "neg" : "pos");
  };

  const handleJumpToCycle = () => {
    const cycle = parseInt(jumpCycle);
    if (!isNaN(cycle)) {
      const boundedCycle = Math.max(-1, Math.min(cycle, maxCycle));
      setCurrentCycle(boundedCycle);
      setIsNegativeEdge(false);
      setJumpCycle("");
      fetchSignalData(boundedCycle, "pos");
    }
  };

  const verilogCycle = parseInt(
    signalData?.signals.children.testbench.children.cycle_count.value.slice(1),
    2
  );

  return (
    <div className="min-h-screen bg-white">
      <ShadDebuggerHeader
        verilogCycle={verilogCycle}
        currentCycle={currentCycle}
        isNegativeEdge={isNegativeEdge}
        includeNegativeEdges={includeNegativeEdges}
        setIncludeNegativeEdges={setIncludeNegativeEdges}
        maxCycle={maxCycle}
        jumpCycle={jumpCycle}
        setJumpCycle={setJumpCycle}
        handleStart={handleStart}
        handlePreviousCycle={handlePreviousCycle}
        handleNextCycle={handleNextCycle}
        handleEnd={handleEnd}
        handleJumpToCycle={handleJumpToCycle}
        handleKeyDown={handleKeyDown}
      />
      <div className="p-0">
        <div className="bg-white">
          {signalData && (
            <>
              <div className="">
                <div className="flex">
                  <ROBDebugger
                    className="p-8"
                    signalData={
                      signalData?.signals.children.testbench.children.DUT_ooo
                        .children.DUT_rob
                    }
                  />
                  <FNAFDebugger
                    className="m-4"
                    signalFNAF={
                      signalData?.signals.children.testbench.children.DUT_ooo
                        .children.DUT_freddy
                    }
                  />
                  <RSDebugger
                    className="m-4"
                    signalRS={
                      signalData?.signals.children.testbench.children.DUT_ooo
                        .children.DUT_rs
                    }
                  />
                </div>
              </div>
              <DebuggerOutput signalData={signalData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
