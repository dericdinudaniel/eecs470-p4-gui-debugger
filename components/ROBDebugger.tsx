import React, { useState } from "react";

const clog2 = (x: number): number => Math.ceil(Math.log2(x));
const N = 3;
const ROB_SZ = 7;
const PHYS_REG_SZ_R10K = 32 + ROB_SZ;
const PHYS_REG_TAG_SIZE = clog2(PHYS_REG_SZ_R10K);

type RegIdx = string;
type PhysRegTag = string;
interface ROBData {
  T_old: PhysRegTag;
  T_new: PhysRegTag;
  R_dest: RegIdx;
  valid: boolean;
  retireable: boolean;
}

type SignalType = {
  sigType: string;
  width: number;
};

type SignalData = {
  name: string;
  type: SignalType;
  value: string;
};

type ScopeData = {
  [key: string]: SignalData | { children: ScopeData };
};

const DisplayFormat = {
  HEX: "HEX",
  BINARY: "BINARY",
  DECIMAL: "DECIMAL",
} as const;

type DebuggerOutputProps = {
  signalData: {
    cycle: string;
    endpoint: string;
    signals: {
      children: ScopeData;
    };
  } | null;
};

const ROBDebugger: React.FC<DebuggerOutputProps> = ({ signalData }) => {
  return (
    <>
      <div>ROBDebugger</div>
    </>
  );
};

export default ROBDebugger;
