"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DestructiveSwitch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DButton, DHeaderButton } from "./dui/DButton";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

interface DebuggerHeaderProps {
  verilogCycle: number;
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
    <DHeaderButton isPressed={isPressed} onClick={onClick}>
      {children}
    </DHeaderButton>
  );
};

export default function DebuggerHeader({
  verilogCycle,
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
}: DebuggerHeaderProps) {
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
        </div>

        <div className="flex items-center justify-center space-x-2">
          <DebuggerButton onClick={handleStart} shortcutKey="v">
            Start (v)
          </DebuggerButton>
          <DebuggerButton onClick={handlePreviousCycle} shortcutKey="b">
            Prev Cycle (b)
          </DebuggerButton>
          <DebuggerButton onClick={handleNextCycle} shortcutKey="n">
            Next Cycle (n)
          </DebuggerButton>
          <DebuggerButton onClick={handleEnd} shortcutKey="m">
            End (m)
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
              Jump to Cycle (j)
            </DebuggerButton>
          </div>
          <Separator orientation="vertical" className="bg-border/50 mx-2 h-8" />
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
        </div>

        {/* cycle display */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <p className="text-sm font-mono">
              Verilog Cycle:{" "}
              {padWithSpaces(
                Number.isNaN(verilogCycle) ? 0 : verilogCycle,
                maxCycle
              )}
            </p>
            {/* <p className="text-sm font-mono">
              Current Cycle: {padWithSpaces(currentCycle, maxCycle)}
              {isNegativeEdge ? "-" : "+"}
            </p> */}
            <p className="text-sm font-mono">
              Num Cycles: {padWithSpaces(maxCycle + 1, maxCycle)}
            </p>
          </div>
          <div className="flex flex-row items-center space-x-1">
            <p className="text-sm font-mono">
              Current Cycle:
              {/* {padWithSpaces(currentCycle, maxCycle)}
              {isNegativeEdge ? "-" : "+"} */}
            </p>
            <div
              className={`px-3 h-10 rounded-lg text-white flex items-center justify-center text-2xl ${
                isNegativeEdge ? "bg-destructive" : "bg-primary"
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
