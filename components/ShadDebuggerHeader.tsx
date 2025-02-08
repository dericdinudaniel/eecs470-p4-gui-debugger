"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input, TagSearchInput } from "@/components/ui/input";
import { DestructiveSwitch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DHeaderButton } from "./dui/DButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import InfoDialog from "@/components/InfoDialog";
import PaddedNum from "./dui/PaddedNum";
import { useDisplayContext } from "./DisplayContext";
import ConstantsEditor from "./ConstantsEditor";

interface DebuggerHeaderProps {
  signalData: any;
  verilogCycle?: number;
  currentCycle: number;
  isNegativeEdge: boolean;
  negEgdesAvailable: boolean;
  includeNegativeEdges: boolean;
  negedgeAllowed: boolean;
  setIncludeNegativeEdges: (value: boolean) => void;
  maxCycle: number;
  jumpCycle: string;
  setJumpCycle: (value: string) => void;
  handleStart: () => void;
  handlePreviousCycle: () => void;
  handlePrevious10Cycles: () => void;
  handleNextCycle: () => void;
  handleNext10Cycles: () => void;
  handleEnd: () => void;
  handleJumpToCycle: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
    <DHeaderButton isPressed={isPressed} onClick={onClick}>
      {children}
    </DHeaderButton>
  );
};

export default function DebuggerHeader({
  signalData,
  verilogCycle,
  currentCycle,
  isNegativeEdge,
  includeNegativeEdges,
  setIncludeNegativeEdges,
  negedgeAllowed,
  maxCycle,
  jumpCycle,
  setJumpCycle,
  handleStart,
  handlePreviousCycle,
  handlePrevious10Cycles,
  handleNextCycle,
  handleNext10Cycles,
  handleEnd,
  handleJumpToCycle,
  handleKeyDown,
}: DebuggerHeaderProps) {
  const { setTag } = useDisplayContext();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/[.25] bg-background/70 backdrop-blur-sm shadow-md">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <Image
            src="/bloons.png"
            alt="btd6 dartling gunner"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="font-bold text-lg">Chimp Debugger</span>
          <Link
            href="/"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary underline-fade"
          >
            ← Home
          </Link>
          <ThemeToggle />
          <InfoDialog />
          <ConstantsEditor signalData={signalData} />
        </div>

        <div className="flex items-center justify-center space-x-2">
          <DebuggerButton onClick={handleStart} shortcutKey="c">
            Start (c)
          </DebuggerButton>
          <DebuggerButton onClick={handlePrevious10Cycles} shortcutKey="v">
            -10 (v)
          </DebuggerButton>
          <DebuggerButton onClick={handlePreviousCycle} shortcutKey="b">
            -1 (b)
          </DebuggerButton>
          <DebuggerButton onClick={handleNextCycle} shortcutKey="n">
            +1 (n)
          </DebuggerButton>
          <DebuggerButton onClick={handleNext10Cycles} shortcutKey="m">
            +10 (m)
          </DebuggerButton>
          <DebuggerButton onClick={handleEnd} shortcutKey=",">
            End (,)
          </DebuggerButton>

          <Separator orientation="vertical" className="bg-border/50 mx-2 h-8" />

          <div className="flex items-center space-x-2">
            <Input
              id="jumpCycleInput"
              type="number"
              value={jumpCycle}
              onChange={(e) => setJumpCycle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-28 h-9 text-xs"
              placeholder="Cycle #"
            />
            <DebuggerButton onClick={handleJumpToCycle} shortcutKey="j">
              Jump (j)
            </DebuggerButton>
          </div>

          {negedgeAllowed && (
            <>
              <Separator
                orientation="vertical"
                className="bg-border/50 mx-2 h-8"
              />
              <div className="flex flex-col items-center justify-center">
                <Label
                  htmlFor="include-negedges"
                  className="text-[12px] text-muted-foreground underline-fade mb-1"
                >
                  Include Negedges (t)
                </Label>
                <DestructiveSwitch
                  id="include-negedges"
                  checked={includeNegativeEdges}
                  onCheckedChange={setIncludeNegativeEdges}
                />
              </div>
            </>
          )}

          <Separator orientation="vertical" className="bg-border/50 mx-2 h-8" />

          <div>
            <TagSearchInput
              id="searchTag"
              type="number"
              onChange={(e) => setTag(Number(e.target.value))}
              className="w-28 h-9 text-xs text-red"
              placeholder="Tag #"
            />
          </div>
        </div>

        {/* cycle display */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            {verilogCycle != undefined && (
              <p className="text-sm font-mono">Verilog Cycle: {verilogCycle}</p>
            )}

            <p className="text-sm font-mono">
              {/* Num Cycles: {padWithSpaces(maxCycle + 1, maxCycle)} */}
              Num Cycles: {maxCycle}
            </p>
          </div>
          <div className="flex flex-row items-center space-x-1">
            <p className="text-sm font-mono">Current Cycle:</p>
            <div
              className={`px-3 h-10 rounded-lg flex items-center justify-center text-2xl ${
                isNegativeEdge
                  ? "bg-destructive text-white"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {currentCycle}
              {isNegativeEdge ? "-" : "+"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
