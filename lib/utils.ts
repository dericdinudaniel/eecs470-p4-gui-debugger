import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// helper functions

import { parse } from "path";
import { ScopeData, SignalData } from "./tstypes";
import * as Types from "./types";
import * as Constants from "./constants";
import { reverseStr } from "./tsutils";

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

// Helper function to extract bits and convert to number
const extractBits = (
  binaryStr: string,
  startIndex: number,
  length: number
): number => {
  const bitsSlice = binaryStr.slice(startIndex, startIndex + length);
  return parseInt(bitsSlice, 2);
};

export const displayValue = (value: any) => (isNaN(value) ? "XX" : value);

////// ROB
export const parseROBData = (
  entries: string,
  arrLen: number
): Types.ROB_DATA[] => {
  // Remove the 'b' prefix if present
  const binaryStr = entries.startsWith("b") ? entries.slice(1) : entries;

  const result: Types.ROB_DATA[] = [];
  const entryWidth = Types.ROB_DATA_WIDTH;

  // Process each ROB entry from the end to the beginning
  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    let accessIdx = startIdx;

    // Extract fields from left to right in the entry
    const T_old = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const T_new = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const R_dest = extractBits(
      binaryStr,
      accessIdx,
      Types.REG_IDX_WIDTH
    ) as Types.REG_IDX;
    accessIdx += Types.REG_IDX_WIDTH;

    const valid = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const retireable = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const packet = parseID_EX_PACKET(
      binaryStr.slice(accessIdx, accessIdx + Types.ID_EX_PACKET_WIDTH)
    );
    accessIdx += Types.ID_EX_PACKET_WIDTH;

    result.push({
      T_old,
      T_new,
      R_dest,
      valid,
      retireable,
      packet,
    });
  }

  return result;
};

export const parseCDBTags = (cdb: string): Types.PHYS_REG_TAG[] => {
  const binaryStr = cdb.startsWith("b") ? cdb.slice(1) : cdb;

  const result: Types.PHYS_REG_TAG[] = [];
  const entryWidth = Types.PHYS_REG_TAG_WIDTH;

  // Process each CDB entry from the end to the beginning
  for (let i = Constants.CDB_SZ - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const tag = extractBits(binaryStr, startIdx, Types.PHYS_REG_TAG_WIDTH);
    result.push(tag);
  }

  return result;
};

export const parseCDBValues = (cdb: string): Types.DATA[] => {
  const binaryStr = cdb.startsWith("b") ? cdb.slice(1) : cdb;

  const result: Types.DATA[] = [];
  const entryWidth = Types.DATA_WIDTH;

  for (let i = Constants.CDB_SZ - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const data = extractBits(binaryStr, startIdx, Types.DATA_WIDTH);
    result.push(data);
  }

  return result;
};

export const parseID_EX_PACKET = (packetStr: string): Types.ID_EX_PACKET => {
  return {
    inst: {
      inst: parseInt(packetStr, 2),
      itype: "r",
    },
    PC: 0,
    NPC: 0,
    rs1_value: 0,
    rs2_value: 0,
    opa_select: Types.ALU_OPA_SELECT.OPA_IS_RS1,
    opb_select: Types.ALU_OPB_SELECT.OPB_IS_RS2,
    dest_reg_idx: 0,
    alu_func: Types.ALU_FUNC.ALU_ADD,
    mult: false,
    rd_mem: false,
    wr_mem: false,
    cond_branch: false,
    uncond_branch: false,
    halt: false,
    illegal: false,
    csr_op: false,
    valid: false,
  };
};

export const parseFU_DATA = (
  inputStr: string,
  fu: Types.FU_TYPE
): Types.FU_DATA => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const T_new = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
  accessIdx += Types.PHYS_REG_TAG_WIDTH;

  const rs1 = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const rs2 = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const fu_func = parseFU_FUNC(
    binaryStr.slice(accessIdx, accessIdx + Types.FU_FUNC_WIDTH)
  );
  accessIdx += Types.FU_FUNC_WIDTH;

  const b_mask_raw = binaryStr.slice(
    accessIdx,
    accessIdx + Constants.NUM_CHECKPOINTS
  );
  const b_mask = reverseStr(b_mask_raw);
  accessIdx += Constants.NUM_CHECKPOINTS;

  const predicted = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  return {
    T_new,
    rs1,
    rs2,
    valid,
    fu_func,
    b_mask,
    predicted,
  };
};

export const parseFU_DATA_List = (
  inputStr: string,
  fu: Types.FU_TYPE
): Types.FU_DATA[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.FU_DATA[] = [];
  const entryWidth = Types.FU_DATA_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  // Process each FU_DATA entry from the end to the beginning
  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;

    // Extract fields from left to right in the entry
    const fu_data = parseFU_DATA(
      binaryStr.slice(startIdx, startIdx + entryWidth),
      fu
    );

    result.push(fu_data);
  }

  return result;
};

export const getNumFUOut = (fu_list: Types.RS_TO_FU_DATA[]): number => {
  let count = 0;
  for (let i = 0; i < fu_list.length; i++) {
    if (fu_list[i].valid) {
      count++;
    }
  }
  return count;
};

export const parseFU_FUNC = (inputStr: string): Types.FU_FUNC => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  return parseInt(binaryStr, 2) as Types.FU_FUNC;
};

////// RS
export const parseRSData = (
  entries: string,
  arrLen: number
): Types.RS_DATA[] => {
  // Remove the 'b' prefix if present
  const binaryStr = entries.startsWith("b") ? entries.slice(1) : entries;

  const result: Types.RS_DATA[] = [];
  const entryWidth = Types.RS_DATA_WIDTH;

  // Process each ROB entry from the end to the beginning
  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    let accessIdx = startIdx;

    // Extract fields from left to right in the entry
    const occupied = binaryStr[startIdx] === "1";
    accessIdx += 1;

    const fu = extractBits(
      binaryStr,
      accessIdx,
      Types.FU_TYPE_WIDTH
    ) as Types.FU_TYPE;
    accessIdx += Types.FU_TYPE_WIDTH;

    const fu_func = parseFU_FUNC(
      binaryStr.slice(accessIdx, accessIdx + Types.FU_FUNC_WIDTH)
    );
    accessIdx += Types.FU_FUNC_WIDTH;

    const T_new = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const T_a = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const ready_ta = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const T_b = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const ready_tb = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const has_imm = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const imm_value = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
    accessIdx += Types.DATA_WIDTH;

    // b mask is array of boolean, so we need to extract each bit
    // const b_mask: boolean[] = [];
    // for (let j = Constants.NUM_CHECKPOINTS - 1; j >= 0; j--) {
    //   const b_maskAccessIdx = accessIdx + j;
    //   b_mask.push(binaryStr[b_maskAccessIdx] === "1");
    // }
    // accessIdx += Constants.NUM_CHECKPOINTS;
    // console.log(b_mask);
    const b_mask_raw = binaryStr.slice(
      accessIdx,
      accessIdx + Constants.NUM_CHECKPOINTS
    );
    const b_mask = reverseStr(b_mask_raw);
    accessIdx += Constants.NUM_CHECKPOINTS;

    const predicted = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const packet = parseID_EX_PACKET(
      binaryStr.slice(accessIdx, accessIdx + Types.ID_EX_PACKET_WIDTH)
    );
    accessIdx += Types.ID_EX_PACKET_WIDTH;

    result.push({
      occupied,
      fu,
      fu_func,
      T_new,
      T_a,
      ready_ta,
      T_b,
      ready_tb,
      has_imm,
      imm_value,
      b_mask,
      predicted,
      packet,
    });
  }
  return result;
};

export const parseRS_TO_FU_DATA_List = (
  inputStr: string,
  fu_type: Types.FU_TYPE
): Types.RS_TO_FU_DATA[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: Types.RS_TO_FU_DATA[] = [];

  const arrLen = binaryStr.length / Types.RS_TO_FU_DATA_WIDTH;
  const entryWidth = Types.RS_TO_FU_DATA_WIDTH;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    let accessIdx = startIdx;

    const T_new = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const T_a = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const T_b = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const valid = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const fu_func = parseFU_FUNC(
      binaryStr.slice(accessIdx, accessIdx + Types.FU_FUNC_WIDTH)
    );
    accessIdx += Types.FU_FUNC_WIDTH;

    const has_imm = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const imm_value = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
    accessIdx += Types.DATA_WIDTH;

    const b_mask_raw = binaryStr.slice(
      accessIdx,
      accessIdx + Constants.NUM_CHECKPOINTS
    );
    const b_mask = reverseStr(b_mask_raw);
    accessIdx += Constants.NUM_CHECKPOINTS;

    const predicted = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const packet = parseID_EX_PACKET(
      binaryStr.slice(accessIdx, accessIdx + Types.ID_EX_PACKET_WIDTH)
    );

    result.push({
      T_new,
      T_a,
      T_b,
      valid,
      fu_func,
      has_imm,
      imm_value,
      b_mask,
      predicted,
      packet,
    });
  }

  return result;
};

// Frizzy List
export const parseFreeList = (inputStr: string): string[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: string[] = [];

  for (let i = binaryStr.length - 1; i >= 0; i--) {
    result.push(binaryStr[i]);
  }

  return result;
};

export const parseReadyBits = (inputStr: string): string[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: string[] = [];

  for (let i = binaryStr.length - 1; i >= 0; i--) {
    result.push(binaryStr[i]);
  }

  return result;
};

// export const parseFree_PR = (inputStr: string): number[] => {
//   const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

//   // N of PHYS_REG_TAG
//   const result: number[] = [];

//   const arrLen = Constants.N;
//   for (let i = arrLen - 1; i >= 0; i--) {
//     const startIdx = i * Types.PHYS_REG_TAG_WIDTH;
//     const tag = extractBits(binaryStr, startIdx, Types.PHYS_REG_TAG_WIDTH);
//     result.push(tag);
//   }

//   return result;
// };

export const parseReg_Map = (inputStr: string): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  // N of PHYS_REG_TAG
  const result: number[] = [];

  const arrLen = Constants.AR_NUM;
  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * Types.PHYS_REG_TAG_WIDTH;
    const tag = extractBits(binaryStr, startIdx, Types.PHYS_REG_TAG_WIDTH);
    result.push(tag);
  }

  return result;
};

// Register File
export const parseRegfile = (inputStr: string): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const arrLen = binaryStr.length / Types.DATA_WIDTH;

  const result: number[] = [];

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * Types.DATA_WIDTH;
    const data = extractBits(binaryStr, startIdx, Types.DATA_WIDTH);
    result.push(data);
  }

  return result;
};

export const parseRegPortIdx = (
  inputStr: string,
  numPorts: number
): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: number[] = [];

  for (let i = numPorts - 1; i >= 0; i--) {
    const startIdx = i * Types.PHYS_REG_TAG_WIDTH;
    const tag = extractBits(binaryStr, startIdx, Types.PHYS_REG_TAG_WIDTH);
    result.push(tag);
  }

  return result;
};

export const parseRegPortData = (
  inputStr: string,
  numPorts: number
): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: number[] = [];

  for (let i = numPorts - 1; i >= 0; i--) {
    const startIdx = i * Types.DATA_WIDTH;
    const data = extractBits(binaryStr, startIdx, Types.DATA_WIDTH);
    result.push(data);
  }

  return result;
};

export const parseRegPortValid = (
  inputStr: string,
  numPorts: number
): boolean[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: boolean[] = [];

  for (let i = numPorts - 1; i >= 0; i--) {
    result.push(binaryStr[i] === "1");
  }

  return result;
};

// branching stuff
export const parseCHECKPOINT_DATA = (
  inputStr: string
): Types.CHECKPOINT_DATA => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const pc_checkpoint = extractBits(binaryStr, 0, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const bhr_checkpoint_raw = binaryStr.slice(
    accessIdx,
    accessIdx + Constants.BRANCH_PRED_SZ
  );
  const bhr_checkpoint = reverseStr(bhr_checkpoint_raw);
  accessIdx += Constants.BRANCH_PRED_SZ;

  const rob_tail = extractBits(
    binaryStr,
    accessIdx,
    clog2(Constants.ROB_SZ + Constants.N)
  );
  accessIdx += clog2(Constants.ROB_SZ + Constants.N);

  const frizzy_checkpoint = parseFRIZZY_DATA(
    binaryStr.slice(accessIdx, accessIdx + Types.FRIZZY_DATA_WIDTH)
  );
  accessIdx += Types.FRIZZY_DATA_WIDTH;

  const map_checkpoint = parseReg_Map(
    binaryStr.slice(
      accessIdx,
      accessIdx + Constants.AR_NUM * Types.PHYS_REG_TAG_WIDTH
    )
  );

  return {
    pc_checkpoint,
    bhr_checkpoint,
    rob_tail,
    frizzy_checkpoint,
    map_checkpoint,
  };
};

export const parseFRIZZY_DATA = (inputStr: string): Types.FRIZZY_DATA => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const ready = parseReadyBits(binaryStr.slice(0, Constants.PHYS_REG_SZ_R10K));
  const free = parseFreeList(
    binaryStr.slice(Constants.PHYS_REG_SZ_R10K, Constants.PHYS_REG_SZ_R10K * 2)
  );

  return {
    ready,
    free,
  };
};

export const parseCHECKPOINT_DATA_List = (
  inputStr: string
): Types.CHECKPOINT_DATA[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.CHECKPOINT_DATA[] = [];

  const entryWidth = Types.CHECKPOINT_DATA_WIDTH;
  const arrLen = Constants.NUM_CHECKPOINTS;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;

    const checkpoint_data = parseCHECKPOINT_DATA(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );

    result.push(checkpoint_data);
  }

  return result;
};

export const parseToBoolArray = (inputStr: string): boolean[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: boolean[] = [];

  for (let i = binaryStr.length - 1; i >= 0; i--) {
    result.push(binaryStr[i] === "1");
  }

  return result;
};

export const parseBoolArrToString = (inputArr: string): string => {
  const binaryStr = inputArr.startsWith("b") ? inputArr.slice(1) : inputArr;

  return reverseStr(binaryStr);
};
