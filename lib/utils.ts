// helper functions

import { parse } from "path";
import { ScopeData, SignalData } from "./tstypes";
import * as Types from "./types";
import * as Constants from "./constants";

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

    // Extract fields from left to right in the entry
    const T_old = extractBits(binaryStr, startIdx, Types.PHYS_REG_TAG_WIDTH);

    const T_new = extractBits(
      binaryStr,
      startIdx + Types.PHYS_REG_TAG_WIDTH,
      Types.PHYS_REG_TAG_WIDTH
    );

    const R_dest = extractBits(
      binaryStr,
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

export const parseCDBData = (cdb: string): Types.PHYS_REG_TAG[] => {
  const binaryStr = cdb.startsWith("b") ? cdb.slice(1) : cdb;

  const result: Types.PHYS_REG_TAG[] = [];
  const entryWidth = Types.PHYS_REG_TAG_WIDTH;

  // Process each CDB entry from the end to the beginning
  for (let i = Constants.CDB_SZ - 1; i >= 0; i--) {
    const startIdx = i * entryWidth;

    // Extract fields from left to right in the entry
    const tag = extractBits(binaryStr, startIdx, Types.PHYS_REG_TAG_WIDTH);

    result.push(tag);
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

export const parseMULT_DATA = (inputStr: string): Types.MULT_DATA => {
  let accessIdx = 0;

  const T_new = extractBits(inputStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
  accessIdx += Types.PHYS_REG_TAG_WIDTH;

  const rs1 = extractBits(inputStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const rs2 = extractBits(inputStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const valid = inputStr[accessIdx] === "1";
  accessIdx += 1;

  const func = extractBits(
    inputStr,
    accessIdx,
    Types.MULT_FUNC_WIDTH
  ) as Types.MULT_FUNC;
  accessIdx += Types.MULT_FUNC_WIDTH;

  return {
    T_new,
    rs1,
    rs2,
    func,
    valid,
  };
};

export const parseALU_DATA = (inputStr: string): Types.ALU_DATA => {
  let accessIdx = 0;

  const T_new = extractBits(inputStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
  accessIdx += Types.PHYS_REG_TAG_WIDTH;

  const rs1 = extractBits(inputStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const rs2 = extractBits(inputStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const valid = inputStr[accessIdx] === "1";
  accessIdx += 1;

  const func = extractBits(
    inputStr,
    accessIdx,
    Types.ALU_FUNC_WIDTH
  ) as Types.ALU_FUNC;
  accessIdx += Types.ALU_FUNC_WIDTH;

  return {
    T_new,
    rs1,
    rs2,
    func,
    valid,
  };
};

export const parseBRANCH_DATA = (inputStr: string): Types.BRANCH_DATA => {
  let accessIdx = 0;

  const T_new = extractBits(inputStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
  accessIdx += Types.PHYS_REG_TAG_WIDTH;

  const rs1 = extractBits(inputStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const rs2 = extractBits(inputStr, accessIdx, Types.DATA_WIDTH);
  accessIdx += Types.DATA_WIDTH;

  const valid = inputStr[accessIdx] === "1";
  accessIdx += 1;

  const func = extractBits(
    inputStr,
    accessIdx,
    Types.BRANCH_FUNC_WIDTH
  ) as Types.BRANCH_FUNC;
  accessIdx += Types.BRANCH_FUNC_WIDTH;

  return {
    T_new,
    rs1,
    rs2,
    func,
    valid,
  };
};

const parseFU_DATA = (inputStr: string, fu: Types.FU_TYPE): Types.FU_DATA => {
  switch (fu) {
    case Types.FU_TYPE.MUL:
      return { fu_type: Types.FU_TYPE.MUL, data: parseMULT_DATA(inputStr) };
    case Types.FU_TYPE.ALU:
      return { fu_type: Types.FU_TYPE.ALU, data: parseALU_DATA(inputStr) };
    case Types.FU_TYPE.BR:
      return { fu_type: Types.FU_TYPE.BR, data: parseBRANCH_DATA(inputStr) };
    default:
      return {
        fu_type: Types.FU_TYPE.ALU,
        data: {
          T_new: 0,
          rs1: 0,
          rs2: 0,
          func: Types.ALU_FUNC.ALU_ADD,
          valid: false,
        },
      };
  }
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

    const fu_data = parseFU_DATA(
      binaryStr.slice(accessIdx, accessIdx + Types.FU_DATA_WIDTH),
      fu
    );
    accessIdx += Types.FU_DATA_WIDTH;

    const T_dest = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const T_a = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const ready_ta = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    const T_b = extractBits(binaryStr, accessIdx, Types.PHYS_REG_TAG_WIDTH);
    accessIdx += Types.PHYS_REG_TAG_WIDTH;

    const ready_tb = binaryStr[accessIdx] === "1";
    accessIdx += 1;

    // skiping packet for now (not implemented yet), use a dummy packet with all bytes set to 0
    const packet = parseID_EX_PACKET(
      binaryStr.slice(accessIdx, accessIdx + Types.ID_EX_PACKET_WIDTH)
    );
    accessIdx += Types.ID_EX_PACKET_WIDTH;

    result.push({
      occupied,
      fu,
      fu_data,
      T_dest,
      T_a,
      ready_ta,
      T_b,
      ready_tb,
      packet,
    });
  }

  return result;
};

export const displayValue = (value: any) => (isNaN(value) ? "XX" : value);
