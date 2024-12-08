import { Instruction } from "./rvcodec.js/Instruction";
import { ScopeData } from "./tstypes";
import { constantsStore } from "@/lib/constants-store";
import {
  extractSignalValue,
  parseCDBTags,
  parseFU_DATA_List,
  parseSQ_DATA_List,
} from "./utils";
import * as Types from "./types";

export const parseInstruction = (instruction: number): string => {
  // convert number to hex string
  const hexStr = instruction.toString(16).padStart(8, "0");

  try {
    const inst = new Instruction(hexStr);
    return inst.asm;
  } catch (e) {
    return "Invalid Instr";
  }
};

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

export const reverseStr = (str: string): string => {
  return str.split("").reverse().join("");
};
