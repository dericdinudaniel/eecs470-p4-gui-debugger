import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// helper functions

import { ScopeData, SignalData } from "./tstypes";
import * as Types from "./types";
import { constantsStore as Constants } from "./constants-store";

import { reverseStr } from "./tsutils";

export const clog2 = (x: number): number => Math.ceil(Math.log2(x));

export function binaryStringToInt(binaryString: string): number {
  // Remove the leading 'b' and parse the rest as a binary number

  // if an 'x' is present, return NaN
  if (binaryString.includes("x")) return NaN;

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

export const extractSignalValueToBool = (
  signalData: ScopeData,
  name: string
): boolean => {
  return Boolean(extractSignalValueToInt(signalData, name));
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
export const displayValueHex = (value: number) =>
  isNaN(value) ? "XX" : value.toString(16);

////// ROB
export const parseROBData = (entries: string): Types.ROB_DATA[] => {
  // Remove the 'b' prefix if present
  const binaryStr = entries.startsWith("b") ? entries.slice(1) : entries;

  const result: Types.ROB_DATA[] = [];
  const entryWidth = Types.ROB_DATA_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

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

    const halt = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const store = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const branch = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const NPC = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
    accessIdx += Types.ADDR_WIDTH;

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
      halt,
      store,
      branch,
      NPC,
      packet,
    });
  }

  return result;
};

export const parseCDBTags = (cdb: string): Types.PHYS_REG_TAG[] => {
  const binaryStr = cdb.startsWith("b") ? cdb.slice(1) : cdb;

  const result: Types.PHYS_REG_TAG[] = [];
  const entryWidth = Types.PHYS_REG_TAG_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  // Process each CDB entry from the end to the beginning
  for (let i = arrLen - 1; i >= 0; i--) {
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
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const data = extractBits(binaryStr, startIdx, Types.DATA_WIDTH);
    result.push(data);
  }

  return result;
};

// export const parseID_EX_PACKET_OLD = (
//   packetStr: string
// ): Types.ID_EX_PACKET => {
//   const binaryStr = packetStr.startsWith("b") ? packetStr.slice(1) : packetStr;
//   return {
//     inst: {
//       inst: parseInt(binaryStr, 2),
//       itype: "r",
//     },
//     PC: 0,
//     NPC: 0,
//     rs1_value: 0,
//     rs2_value: 0,
//     opa_select: Types.ALU_OPA_SELECT.OPA_IS_RS1,
//     opb_select: Types.ALU_OPB_SELECT.OPB_IS_RS2,
//     dest_reg_idx: 0,
//     alu_func: Types.ALU_FUNC.ALU_ADD,
//     mult: false,
//     rd_mem: false,
//     wr_mem: false,
//     cond_branch: false,
//     uncond_branch: false,
//     halt: false,
//     illegal: false,
//     csr_op: false,
//     valid: false,
//   };
// };

export const parseID_EX_PACKET = (packetStr: string): Types.ID_EX_PACKET => {
  const binaryStr = packetStr.startsWith("b") ? packetStr.slice(1) : packetStr;
  let accessIdx = 0;

  const inst = extractBits(binaryStr, accessIdx, Types.INST_WIDTH);
  accessIdx += Types.INST_WIDTH;

  const PC = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const NPC = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const rs1_value = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const rs2_value = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const opa_select = extractBits(
    binaryStr,
    accessIdx,
    Types.ALU_OPA_SELECT_WIDTH
  ) as Types.ALU_OPA_SELECT;
  accessIdx += Types.ALU_OPA_SELECT_WIDTH;

  const opb_select = extractBits(
    binaryStr,
    accessIdx,
    Types.ALU_OPB_SELECT_WIDTH
  ) as Types.ALU_OPB_SELECT;
  accessIdx += Types.ALU_OPB_SELECT_WIDTH;

  const dest_reg_idx = extractBits(
    binaryStr,
    accessIdx,
    Types.REG_IDX_WIDTH
  ) as Types.REG_IDX;
  accessIdx += Types.REG_IDX_WIDTH;

  const alu_func = extractBits(
    binaryStr,
    accessIdx,
    Types.ALU_FUNC_WIDTH
  ) as Types.ALU_FUNC;
  accessIdx += Types.ALU_FUNC_WIDTH;

  const mult = binaryStr[accessIdx] === "1";
  accessIdx += 1;
  const rd_mem = binaryStr[accessIdx] === "1";
  accessIdx += 1;
  const wr_mem = binaryStr[accessIdx] === "1";
  accessIdx += 1;
  const cond_branch = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const bhr = binaryStr.slice(
    accessIdx,
    accessIdx + Constants.get("BRANCH_PRED_SZ")
  );
  accessIdx += Constants.get("BRANCH_PRED_SZ");
  const predicted_direction = binaryStr[accessIdx] === "1";
  accessIdx += 1;
  const predicted_target = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const uncond_branch = binaryStr[accessIdx] === "1";
  accessIdx += 1;
  const halt = binaryStr[accessIdx] === "1";
  accessIdx += 1;
  const illegal = binaryStr[accessIdx] === "1";
  accessIdx += 1;
  const csr_op = binaryStr[accessIdx] === "1";
  accessIdx += 1;
  const valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  return {
    inst,
    PC,
    NPC,
    rs1_value,
    rs2_value,
    opa_select,
    opb_select,
    dest_reg_idx,
    alu_func,
    mult,
    rd_mem,
    wr_mem,
    cond_branch,
    bhr,
    predicted_direction,
    predicted_target,
    uncond_branch,
    halt,
    illegal,
    csr_op,
    valid,
  };
};

export const parseID_EX_PACKET_List = (
  inputStr: string
): Types.ID_EX_PACKET[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.ID_EX_PACKET[] = [];
  const entryWidth = Types.ID_EX_PACKET_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const packet = parseID_EX_PACKET(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );
    result.push(packet);
  }
  return result;
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

  const b_mask = binaryStr.slice(
    accessIdx,
    accessIdx + Constants.get("NUM_CHECKPOINTS")
  );
  accessIdx += Constants.get("NUM_CHECKPOINTS");

  const saved_tail = extractBits(binaryStr, accessIdx, Types.SQ_IDX_WIDTH);
  accessIdx += Types.SQ_IDX_WIDTH;

  const PC = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const imm = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  return {
    T_new,
    rs1,
    rs2,
    valid,
    fu_func,
    b_mask,
    saved_tail,
    PC,
    imm,
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
export const parseRSData = (entries: string): Types.RS_DATA[] => {
  // Remove the 'b' prefix if present
  const binaryStr = entries.startsWith("b") ? entries.slice(1) : entries;

  const result: Types.RS_DATA[] = [];
  const entryWidth = Types.RS_DATA_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

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

    const rs_to_fu_data = parseRS_TO_FU_DATA(
      binaryStr.slice(accessIdx, accessIdx + Types.RS_TO_FU_DATA_WIDTH),
      fu
    );
    accessIdx += Types.RS_TO_FU_DATA_WIDTH;

    const ready_ta = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const ready_tb = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    result.push({
      occupied,
      fu,
      rs_to_fu_data,
      ready_ta,
      ready_tb,
    });
  }

  return result;
};

export const parseRS_TO_FU_DATA = (
  inputStr: string,
  fu_type: Types.FU_TYPE
): Types.RS_TO_FU_DATA => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

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

  const b_mask = binaryStr.slice(
    accessIdx,
    accessIdx + Constants.get("NUM_CHECKPOINTS")
  );
  accessIdx += Constants.get("NUM_CHECKPOINTS");

  const PC = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const saved_tail = extractBits(binaryStr, accessIdx, Types.SQ_IDX_WIDTH);
  accessIdx += Types.SQ_IDX_WIDTH;

  const packet = parseID_EX_PACKET(
    binaryStr.slice(accessIdx, accessIdx + Types.ID_EX_PACKET_WIDTH)
  );

  return {
    T_new,
    T_a,
    T_b,
    valid,
    fu_func,
    has_imm,
    imm_value,
    b_mask,
    PC,
    saved_tail,
    packet,
  };
};

export const parseRS_TO_FU_DATA_List = (
  inputStr: string,
  fu_type: Types.FU_TYPE
): Types.RS_TO_FU_DATA[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: Types.RS_TO_FU_DATA[] = [];

  const entryWidth = Types.RS_TO_FU_DATA_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const rs_to_fu_data = parseRS_TO_FU_DATA(
      binaryStr.slice(startIdx, startIdx + entryWidth),
      fu_type
    );

    result.push(rs_to_fu_data);
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

//   const arrLen = Constants.get('N');
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
  const entryWidth = Types.PHYS_REG_TAG_WIDTH;
  const arrLen = binaryStr.length / entryWidth;
  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const tag = extractBits(binaryStr, startIdx, entryWidth);
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

export const parseRegPortIdx = (inputStr: string): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const entryWidth = Types.PHYS_REG_TAG_WIDTH;
  const arrLen = binaryStr.length / entryWidth;
  const result: number[] = [];

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * Types.PHYS_REG_TAG_WIDTH;
    const tag = extractBits(binaryStr, startIdx, Types.PHYS_REG_TAG_WIDTH);
    result.push(tag);
  }

  return result;
};

export const parseRegPortData = (inputStr: string): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const entryWidth = Types.DATA_WIDTH;
  const arrLen = binaryStr.length / entryWidth;
  const result: number[] = [];

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * Types.DATA_WIDTH;
    const data = extractBits(binaryStr, startIdx, Types.DATA_WIDTH);
    result.push(data);
  }

  return result;
};

export const parseRegPortValid = (inputStr: string): boolean[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const entryWidth = 1;
  const arrLen = binaryStr.length / entryWidth;
  const result: boolean[] = [];

  for (let i = arrLen - 1; i >= 0; i--) {
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

  const predicted_direction = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const predicted_target = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const resolving_branch_direction = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const recovery_target = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const branch_PC = extractBits(binaryStr, 0, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const checkpointed_bhr = binaryStr.slice(
    accessIdx,
    accessIdx + Constants.get("BRANCH_PRED_SZ")
  );
  accessIdx += Constants.get("BRANCH_PRED_SZ");

  const rob_tail = extractBits(
    binaryStr,
    accessIdx,
    clog2(Constants.get("ROB_SZ") + Constants.get("N"))
  );
  accessIdx += clog2(Constants.get("ROB_SZ") + Constants.get("N"));

  const sq_tail = extractBits(binaryStr, accessIdx, Types.SQ_IDX_WIDTH);
  accessIdx += Types.SQ_IDX_WIDTH;

  const frizzy_checkpoint = parseFRIZZY_DATA(
    binaryStr.slice(accessIdx, accessIdx + Types.FRIZZY_DATA_WIDTH)
  );
  accessIdx += Types.FRIZZY_DATA_WIDTH;

  const map_checkpoint = parseReg_Map(
    binaryStr.slice(
      accessIdx,
      accessIdx + Constants.get("AR_NUM") * Types.PHYS_REG_TAG_WIDTH
    )
  );

  return {
    predicted_direction,
    predicted_target,
    resolving_branch_direction,
    recovery_target,
    branch_PC,
    checkpointed_bhr,
    rob_tail,
    sq_tail,
    frizzy_checkpoint,
    map_checkpoint,
  };
};

export const parseFRIZZY_DATA = (inputStr: string): Types.FRIZZY_DATA => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const ready = parseReadyBits(
    binaryStr.slice(0, Constants.get("PHYS_REG_SZ_R10K"))
  );
  const free = parseFreeList(
    binaryStr.slice(
      Constants.get("PHYS_REG_SZ_R10K"),
      Constants.get("PHYS_REG_SZ_R10K") * 2
    )
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
  const arrLen = Constants.get("NUM_CHECKPOINTS");

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;

    const checkpoint_data = parseCHECKPOINT_DATA(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );

    result.push(checkpoint_data);
  }
  return result;
};

export const parseBoolArrToBoolArray = (inputStr: string): boolean[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: boolean[] = [];
  for (let i = binaryStr.length - 1; i >= 0; i--) {
    result.push(binaryStr[i] === "1");
  }
  return result;
};

export const parseBoolArrToString = (inputArr: string): string => {
  const binaryStr = inputArr.startsWith("b") ? inputArr.slice(1) : inputArr;
  return binaryStr;
};

export const parseFU_TO_BS_DATA = (inputStr: string): Types.FU_TO_BS_DATA => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const bmask = binaryStr.slice(
    accessIdx,
    accessIdx + Constants.get("NUM_CHECKPOINTS")
  );
  accessIdx += Constants.get("NUM_CHECKPOINTS");

  const taken = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const is_jalr = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const target = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  return {
    bmask,
    taken,
    is_jalr,
    target,
  };
};

export const parsePREDICTOR_STATE_T_List = (
  inputStr: string
): Types.PREDICTOR_STATE_T[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.PREDICTOR_STATE_T[] = [];

  const entryWidth = Types.PREDICTOR_STATE_T_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const state = extractBits(binaryStr, startIdx, entryWidth);
    result.push(state as Types.PREDICTOR_STATE_T);
  }

  return result;
};

// I Cache
export const parse_to_INST_List = (inputStr: string): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: number[] = [];

  const entryWidth = Types.INST_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const inst = extractBits(binaryStr, startIdx, entryWidth);
    result.push(inst);
  }

  return result;
};

export const parseADDR_List = (inputStr: string): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: number[] = [];

  const entryWidth = Types.ADDR_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const addr = extractBits(binaryStr, startIdx, entryWidth);
    result.push(addr);
  }

  return result;
};

export const parseMEM_COMMAND = (inputStr: string): Types.MEM_COMMAND => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  return extractBits(
    binaryStr,
    0,
    Types.MEM_COMMAND_WIDTH
  ) as Types.MEM_COMMAND;
};

export const parseI$_tags = (inputStr: string): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: number[] = [];

  const entryWidth = 12 - Constants.get("ICACHE_LINE_BITS") + 1;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const tag = extractBits(binaryStr, startIdx, entryWidth);
    result.push(tag);
  }

  return result;
};

export const parseI$_indexes = (inputStr: string): number[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: number[] = [];

  const entryWidth = Constants.get("ICACHE_LINE_BITS");
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const index = extractBits(binaryStr, startIdx, entryWidth);
    result.push(index);
  }

  return result;
};

export const parseICACHE_TAG = (inputStr: string): Types.ICACHE_TAG => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  let accessIdx = 0;

  const tags = extractBits(
    binaryStr,
    accessIdx,
    12 - Constants.get("ICACHE_LINE_BITS") + 1
  );
  accessIdx += 12 - Constants.get("ICACHE_LINE_BITS") + 1;

  const valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  return {
    tags,
    valid,
  };
};

export const parseICACHE_TAG_List = (inputStr: string): Types.ICACHE_TAG[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: Types.ICACHE_TAG[] = [];

  const entryWidth = Types.ICACHE_TAG_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const tag = parseICACHE_TAG(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );

    result.push(tag);
  }

  return result;
};

export const parseSQ_DATA = (inputStr: string): Types.SQ_DATA => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const T_new = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
  accessIdx += Types.PHYS_REG_TAG_WIDTH;

  const store_address = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const store_type = parseFU_FUNC(
    binaryStr.slice(accessIdx, accessIdx + Types.FU_FUNC_WIDTH)
  ) as Types.STORE_FUNC;
  accessIdx += Types.FU_FUNC_WIDTH;

  const address_valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const store_data = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const ready_mem = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  return {
    T_new,
    store_address,
    store_type,
    address_valid,
    store_data,
    valid,
    ready_mem,
  };
};

export const parseSQ_DATA_List = (inputStr: string): Types.SQ_DATA[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  const result: Types.SQ_DATA[] = [];

  const entryWidth = Types.SQ_DATA_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const sq_data = parseSQ_DATA(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );

    result.push(sq_data);
  }

  return result;
};

export const parseSTR_CMPLT = (inputStr: string): Types.STR_CMPLT => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const address_valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const index = extractBits(binaryStr, accessIdx, Types.SQ_IDX_WIDTH);
  accessIdx += Types.SQ_IDX_WIDTH;

  const store_address = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const store_data = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  return {
    address_valid,
    index,
    store_address,
    store_data,
  };
};

export const parseSTR_CMPLT_List = (inputStr: string): Types.STR_CMPLT[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.STR_CMPLT[] = [];

  const entryWidth = Types.STR_CMPLT_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const str_cmplt = parseSTR_CMPLT(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );
    result.push(str_cmplt);
  }

  return result;
};

export const parseSQ_RETIRE = (inputStr: string): Types.SQ_RETIRE => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const store_address = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const store_data = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  return {
    valid,
    store_address,
    store_data,
  };
};

export const parseSQ_RETIRE_List = (inputStr: string): Types.SQ_RETIRE[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.SQ_RETIRE[] = [];

  const entryWidth = Types.SQ_RETIRE_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const retire = parseSQ_RETIRE(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );
    result.push(retire);
  }

  return result;
};

export const parseRS_ADDRESS_CHECK = (
  inputStr: string
): Types.RS_ADDRESS_CHECK => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const address_valid_req = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const saved_tail = extractBits(binaryStr, accessIdx, Types.SQ_IDX_WIDTH);
  accessIdx += Types.SQ_IDX_WIDTH;

  return {
    address_valid_req,
    saved_tail,
  };
};

export const parseLOAF_FORWARD_REQ = (
  inputStr: string
): Types.LOAF_FORWARD_REQ => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const load_data_req = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const forwarding_address = extractBits(
    binaryStr,
    accessIdx,
    Types.ADDR_WIDTH
  );
  accessIdx += Types.ADDR_WIDTH;

  const load_type = parseFU_FUNC(
    binaryStr.slice(accessIdx, accessIdx + Types.FU_FUNC_WIDTH)
  ) as Types.LOAD_FUNC;
  accessIdx += Types.FU_FUNC_WIDTH;

  const sq_tail = extractBits(binaryStr, accessIdx, Types.SQ_IDX_WIDTH);
  accessIdx += Types.SQ_IDX_WIDTH;

  return {
    load_data_req,
    forwarding_address,
    load_type,
    sq_tail,
  };
};

export const parseLOAF_FORWARD_REQ_List = (
  inputStr: string
): Types.LOAF_FORWARD_REQ[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.LOAF_FORWARD_REQ[] = [];

  const entryWidth = Types.LOAF_FORWARD_REQ_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const req = parseLOAF_FORWARD_REQ(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );
    result.push(req);
  }

  return result;
};

export const parseLOAF_FORWARD_RESULT = (
  inputStr: string
): Types.LOAF_FORWARD_RESULT => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const forwarded_valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const stall_LOAF = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  const forwarding_data = extractBits(binaryStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  return {
    forwarded_valid,
    stall_LOAF,
    forwarding_data,
  };
};

export const parseLOAF_FORWARD_RESULT_List = (
  inputStr: string
): Types.LOAF_FORWARD_RESULT[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.LOAF_FORWARD_RESULT[] = [];

  const entryWidth = Types.LOAF_FORWARD_RESULT_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const loaf_fwd_result = parseLOAF_FORWARD_RESULT(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );
    result.push(loaf_fwd_result);
  }

  return result;
};

export const parseSQ_IDX = (inputStr: string): Types.SQ_IDX => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  return parseInt(binaryStr, 2) as Types.SQ_IDX;
};

export const parseSQ_IDX_List = (inputStr: string): Types.SQ_IDX[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.SQ_IDX[] = [];

  const entryWidth = Types.SQ_IDX_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const idx = parseSQ_IDX(binaryStr.slice(startIdx, startIdx + entryWidth));
    result.push(idx);
  }

  return result;
};

// DCACHE
// MEM_BLOCK is just an array of 2 DATA values
export const parseMEM_BLOCK = (inputStr: string): Types.MEM_BLOCK => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.MEM_BLOCK = [];

  const entryWidth = Types.DATA_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  if (arrLen !== 2) {
    throw new Error(`Invalid MEM_BLOCK length: ${arrLen}`);
  }

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const data = extractBits(binaryStr, startIdx, entryWidth);
    result.push(data);
  }

  return result;
};

export const parseMEM_BLOCK_List = (inputStr: string): Types.MEM_BLOCK[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.MEM_BLOCK[] = [];

  const entryWidth = Types.MEM_BLOCK_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const block = parseMEM_BLOCK(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );
    result.push(block);
  }

  return result;
};

export const parseDCACHE_TAG = (inputStr: string): Types.DCACHE_TAG => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const tags = extractBits(
    binaryStr,
    accessIdx,
    12 - Constants.get("DCACHE_LINE_BITS") + 1
  );
  accessIdx += 12 - Constants.get("DCACHE_LINE_BITS") + 1;

  const valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  return {
    tags,
    valid,
  };
};

export const parseDCACHE_TAG_List = (inputStr: string): Types.DCACHE_TAG[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.DCACHE_TAG[] = [];

  const entryWidth = Types.DCACHE_TAG_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const tag = parseDCACHE_TAG(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );
    result.push(tag);
  }

  return result;
};

export const parseMSHR_TYPE = (inputStr: string): Types.MSHR_TYPE => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;

  return parseInt(binaryStr, 2) as Types.MSHR_TYPE;
};

export const parseMSHR_DATA = (inputStr: string): Types.MSHR_DATA => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const block_addr = extractBits(binaryStr, accessIdx, 14); // idk why rick chose magic number 14
  accessIdx += 14;

  const data = parseMEM_BLOCK(
    binaryStr.slice(accessIdx, accessIdx + Types.MEM_BLOCK_WIDTH)
  );
  accessIdx += Types.MEM_BLOCK_WIDTH;

  const bitmask = reverseStr(binaryStr.slice(accessIdx, accessIdx + 9)); // idk why rick chose magic number 9
  accessIdx += 9;

  const state = parseMSHR_TYPE(
    binaryStr.slice(accessIdx, accessIdx + Types.MSHR_TYPE_WIDTH)
  );
  accessIdx += Types.MSHR_TYPE_WIDTH;

  return {
    block_addr,
    data,
    bitmask,
    state,
  };
};

export const parseMSHR_DATA_List = (inputStr: string): Types.MSHR_DATA[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.MSHR_DATA[] = [];

  const entryWidth = Types.MSHR_DATA_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const mshr_data = parseMSHR_DATA(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );
    result.push(mshr_data);
  }

  return result;
};

export const parseIF_ID_PACKET = (inputStr: string): Types.IF_ID_PACKET => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  let accessIdx = 0;

  const inst = extractBits(binaryStr, accessIdx, Types.INST_WIDTH);
  accessIdx += Types.INST_WIDTH;

  const PC = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const NPC = extractBits(binaryStr, accessIdx, Types.ADDR_WIDTH);
  accessIdx += Types.ADDR_WIDTH;

  const valid = binaryStr[accessIdx] === "1";
  accessIdx += 1;

  return {
    inst,
    PC,
    NPC,
    valid,
  };
};

export const parseIF_ID_PACKET_List = (
  inputStr: string
): Types.IF_ID_PACKET[] => {
  const binaryStr = inputStr.startsWith("b") ? inputStr.slice(1) : inputStr;
  const result: Types.IF_ID_PACKET[] = [];

  const entryWidth = Types.IF_ID_PACKET_WIDTH;
  const arrLen = binaryStr.length / entryWidth;

  for (let i = arrLen - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;
    const packet = parseIF_ID_PACKET(
      binaryStr.slice(startIdx, startIdx + entryWidth)
    );
    result.push(packet);
  }

  return result;
};
