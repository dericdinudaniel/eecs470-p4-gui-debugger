// helper functions

import { parse } from "path";
import { ScopeData, SignalData } from "./tstypes";
import * as Types from "./types";

export const clog2 = (x: number): number => Math.ceil(Math.log2(x));

export function binaryStringToInt(binaryString: string): number {
  // Remove the leading 'b' and parse the rest as a binary number
  return parseInt(binaryString.slice(1), 2);
}

// function to extract values from the signal data
export const extractSignalValue = (
  signalData: ScopeData,
  name: string
): SignalData => {
  return (signalData as unknown as { children: ScopeData }).children[
    name
  ] as SignalData;
};

export const extractSignalValueToInt = (
  signalData: ScopeData,
  name: string
): number => {
  let signalValue = (
    (signalData as unknown as { children: ScopeData }).children[
      name
    ] as SignalData
  ).value;

  return signalValue.startsWith("b")
    ? binaryStringToInt(signalValue)
    : parseInt(signalValue);
};

////// ROB
export const parseROBData = (
  entries: string,
  arrLen: number
): Types.ROB_DATA[] => {
  // Remove the 'b' prefix if present
  const binaryStr = entries.startsWith("b") ? entries.slice(1) : entries;

  const result: Types.ROB_DATA[] = [];
  const entryWidth = Types.ROB_DATA_WIDTH;

  // Helper function to extract bits and convert to number
  const extractBits = (startIndex: number, length: number): number => {
    const bitsSlice = binaryStr.slice(startIndex, startIndex + length);
    return parseInt(bitsSlice, 2);
  };

  // Process each ROB entry from the end to the beginning
  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;

    // Extract fields from left to right in the entry
    const T_old = extractBits(startIdx, Types.PHYS_REG_TAG_WIDTH);

    const T_new = extractBits(
      startIdx + Types.PHYS_REG_TAG_WIDTH,
      Types.PHYS_REG_TAG_WIDTH
    );

    const R_dest = extractBits(
      startIdx + 2 * Types.PHYS_REG_TAG_WIDTH,
      Types.REG_IDX_WIDTH
    );

    const valid =
      binaryStr[
        startIdx + 2 * Types.PHYS_REG_TAG_WIDTH + Types.REG_IDX_WIDTH
      ] === "1";

    const retireable =
      binaryStr[
        startIdx + 2 * Types.PHYS_REG_TAG_WIDTH + Types.REG_IDX_WIDTH + 1
      ] === "1";

    result.push({
      T_old,
      T_new,
      R_dest,
      valid,
      retireable,
    });
  }

  return result;
};

