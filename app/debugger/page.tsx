// app/debugger/page.tsx

"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DisplayContextProvider } from "@/components/DisplayContext";
import DisplayAll from "@/components/DisplayAll";
import ShadDebuggerHeader from "@/components/ShadDebuggerHeader";
import { useConstantsStore } from "@/lib/constants-store";

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
        case "m":
          handleNext10Cycles();
          break;
        case "b":
          handlePreviousCycle();
          break;
        case "v":
          handlePrevious10Cycles();
          break;
        case "c":
          handleStart();
          break;
        case ",":
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
  const handleNext10Cycles = () => {
    if (includeNegativeEdges) {
      if (!isNegativeEdge) {
        setIsNegativeEdge(true);
        fetchSignalData(currentCycle, "neg");
      } else {
        setIsNegativeEdge(false);
        setCurrentCycle((prev) => Math.min(prev + 10, maxCycle));
        fetchSignalData(Math.min(currentCycle + 10, maxCycle), "pos");
      }
    } else {
      setCurrentCycle((prev) => Math.min(prev + 10, maxCycle));
      setIsNegativeEdge(false);
      fetchSignalData(Math.min(currentCycle + 10, maxCycle), "pos");
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
  const handlePrevious10Cycles = () => {
    if (includeNegativeEdges) {
      if (isNegativeEdge) {
        setIsNegativeEdge(false);
        fetchSignalData(currentCycle, "pos");
      } else if (currentCycle > 0 || (currentCycle === 0 && isNegativeEdge)) {
        setIsNegativeEdge(true);
        setCurrentCycle((prev) => Math.max(prev - 10, -1));
        fetchSignalData(Math.max(currentCycle - 10, -1), "neg");
      }
    } else {
      setCurrentCycle((prev) => Math.max(prev - 10, 0));
      setIsNegativeEdge(false);
      fetchSignalData(Math.max(currentCycle - 10, 0), "pos");
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

  const [hasRunAutoDetect, setHasRunAutoDetect] = useState(false);
  const { autoDetectConstants } = useConstantsStore();
  useEffect(() => {
    if (signalData && !hasRunAutoDetect) {
      autoDetectConstants(signalData);
      setHasRunAutoDetect(true); // Ensure it only runs once
    }
  }, [signalData, hasRunAutoDetect]);

  const testbench = signalData?.signals.children.testbench;

  const verilogCycle = parseInt(
    testbench?.children.cycle_count.value.slice(1),
    2
  );

  return (
    <DisplayContextProvider signalData={signalData}>
      <div className="min-h-screen bg-background">
        <ShadDebuggerHeader
          signalData={signalData}
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
          handlePrevious10Cycles={handlePrevious10Cycles}
          handleNextCycle={handleNextCycle}
          handleNext10Cycles={handleNext10Cycles}
          handleEnd={handleEnd}
          handleJumpToCycle={handleJumpToCycle}
          handleKeyDown={handleKeyDown}
        />

        <div className="m-4 space-y-4">
          {signalData && <DisplayAll className="" signalData={signalData} />}
        </div>
      </div>
    </DisplayContextProvider>
  );
}
