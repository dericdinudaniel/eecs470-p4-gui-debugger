import * as Constants from "./constants";
import { clog2 } from "./utils";

// Word and register sizes
export type ADDR = number; // 32-bit address
export type DATA = number; // 32-bit data
export type REG_IDX = number; // 5-bit register index
export const REG_IDX_WIDTH = 5;

// Calculating the bit-width for PHYS_REG_TAG based on clog2(PHYS_REG_SZ_R10K)
export type PHYS_REG_TAG = number;
export const PHYS_REG_TAG_WIDTH = clog2(Constants.PHYS_REG_SZ_R10K);

// MEM_TAG is a 4-bit value
export type MEM_TAG = number; // 4-bit memory tag

// Enum-like structure for memory size
export enum MEM_SIZE {
  BYTE = 0x0,
  HALF = 0x1,
  WORD = 0x2,
  DOUBLE = 0x3,
}

// Memory bus commands
export enum MEM_COMMAND {
  MEM_NONE = 0x0,
  MEM_LOAD = 0x1,
  MEM_STORE = 0x2,
}

// ICACHE_TAG definition
export type ICACHE_TAG = {
  tags: number; // Equivalent to `logic [12 - ICACHE_LINE_BITS:0]`
  valid: boolean;
};

// Enum for exception codes
export enum EXCEPTION_CODE {
  INST_ADDR_MISALIGN = 0x0,
  INST_ACCESS_FAULT = 0x1,
  ILLEGAL_INST = 0x2,
  BREAKPOINT = 0x3,
  LOAD_ADDR_MISALIGN = 0x4,
  LOAD_ACCESS_FAULT = 0x5,
  STORE_ADDR_MISALIGN = 0x6,
  STORE_ACCESS_FAULT = 0x7,
  ECALL_U_MODE = 0x8,
  ECALL_S_MODE = 0x9,
  NO_ERROR = 0xa,
  ECALL_M_MODE = 0xb,
  INST_PAGE_FAULT = 0xc,
  LOAD_PAGE_FAULT = 0xd,
  HALTED_ON_WFI = 0xe,
  STORE_PAGE_FAULT = 0xf,
}

// Representation of RISC-V instruction types
export type INST = {
  inst: number; // 32-bit instruction

  r?: {
    funct7: number; // 7-bit
    rs2: number; // 5-bit
    rs1: number; // 5-bit
    funct3: number; // 3-bit
    rd: number; // 5-bit
    opcode: number; // 7-bit
  };

  i?: {
    imm: number; // 12-bit
    rs1: number; // 5-bit
    funct3: number; // 3-bit
    rd: number; // 5-bit
    opcode: number; // 7-bit
  };

  s?: {
    off: number; // 7-bit
    rs2: number; // 5-bit
    rs1: number; // 5-bit
    funct3: number; // 3-bit
    set: number; // 5-bit
    opcode: number; // 7-bit
  };

  b?: {
    of: number; // 1-bit
    s: number; // 6-bit
    rs2: number; // 5-bit
    rs1: number; // 5-bit
    funct3: number; // 3-bit
    et: number; // 4-bit
    f: number; // 1-bit
    opcode: number; // 7-bit
  };

  u?: {
    imm: number; // 20-bit
    rd: number; // 5-bit
    opcode: number; // 7-bit
  };

  j?: {
    of: number; // 1-bit
    et: number; // 10-bit
    s: number; // 1-bit
    f: number; // 8-bit
    rd: number; // 5-bit
    opcode: number; // 7-bit
  };
};

// ALU operand A input select
export enum ALU_OPA_SELECT {
  OPA_IS_RS1 = 0x0,
  OPA_IS_NPC = 0x1,
  OPA_IS_PC = 0x2,
  OPA_IS_ZERO = 0x3,
}

// ALU operand B input select
export enum ALU_OPB_SELECT {
  OPB_IS_RS2 = 0x0,
  OPB_IS_I_IMM = 0x1,
  OPB_IS_S_IMM = 0x2,
  OPB_IS_B_IMM = 0x3,
  OPB_IS_U_IMM = 0x4,
  OPB_IS_J_IMM = 0x5,
}

// ALU function codes
export enum ALU_FUNC {
  ALU_ADD = 0x0,
  ALU_SUB = 0x1,
  ALU_SLT = 0x2,
  ALU_SLTU = 0x3,
  ALU_AND = 0x4,
  ALU_OR = 0x5,
  ALU_XOR = 0x6,
  ALU_SLL = 0x7,
  ALU_SRL = 0x8,
  ALU_SRA = 0x9,
}

// MULT funct3 code
export enum MULT_FUNC {
  M_MUL,
  M_MULH,
  M_MULHSU,
  M_MULHU,
}

// Branch function
export enum BRANCH_FUNC {
  B_BEQ = 0b000,
  B_BNE = 0b001,
  B_BLT = 0b100,
  B_BGE = 0b101,
  B_BLTU = 0b110,
  B_BGEU = 0b111,
}

// IF_ID Packet
export type IF_ID_PACKET = {
  inst: INST;
  PC: ADDR;
  NPC: ADDR;
  valid: boolean;
};

// ID_EX Packet
export type ID_EX_PACKET = {
  inst: INST;
  PC: ADDR;
  NPC: ADDR;
  rs1_value: DATA;
  rs2_value: DATA;
  opa_select: ALU_OPA_SELECT;
  opb_select: ALU_OPB_SELECT;
  dest_reg_idx: REG_IDX;
  alu_func: ALU_FUNC;
  mult: boolean;
  rd_mem: boolean;
  wr_mem: boolean;
  cond_branch: boolean;
  uncond_branch: boolean;
  halt: boolean;
  illegal: boolean;
  csr_op: boolean;
  valid: boolean;
};

// EX_MEM Packet
export type EX_MEM_PACKET = {
  alu_result: DATA;
  NPC: ADDR;
  take_branch: boolean;
  rs2_value: DATA;
  rd_mem: boolean;
  wr_mem: boolean;
  dest_reg_idx: REG_IDX;
  halt: boolean;
  illegal: boolean;
  csr_op: boolean;
  rd_unsigned: boolean;
  mem_size: MEM_SIZE;
  valid: boolean;
};

// MEM_WB Packet
export type MEM_WB_PACKET = {
  result: DATA;
  NPC: ADDR;
  dest_reg_idx: REG_IDX;
  take_branch: boolean;
  halt: boolean;
  illegal: boolean;
  valid: boolean;
};

// COMMIT Packet
export type COMMIT_PACKET = {
  NPC: ADDR;
  data: DATA;
  reg_idx: REG_IDX;
  halt: boolean;
  illegal: boolean;
  valid: boolean;
};

// MULT data
export type MULT_DATA = {
  T_new: PHYS_REG_TAG;
  rs1: DATA;
  rs2: DATA;
  func: MULT_FUNC;
  valid: boolean;
};

// ALU data
export type ALU_DATA = {
  T_new: PHYS_REG_TAG;
  opa: DATA;
  opb: DATA;
  func: ALU_FUNC;
  valid: boolean;
};

// BRANCH data
export type BRANCH_DATA = {
  T_new: PHYS_REG_TAG;
  rs1: DATA;
  rs2: DATA;
  func: BRANCH_FUNC;
  valid: boolean;
};

// Enum for operation types
export enum OP_TYPE {
  MUL,
  BR,
  ALU,
  MEM,
}

// ROB Data packet
export interface ROB_DATA {
  T_old: PHYS_REG_TAG;
  T_new: PHYS_REG_TAG;
  R_dest: REG_IDX;
  valid: boolean;
  retireable: boolean;
}
export const ROB_DATA_WIDTH = 2 * PHYS_REG_TAG_WIDTH + REG_IDX_WIDTH + 2;

// RS Data packet
export type RS_DATA = {
  T_new: PHYS_REG_TAG;
  T_1: PHYS_REG_TAG;
  T_2: PHYS_REG_TAG;
  OP: OP_TYPE;
};

// FRIZZY Data packet
export type FRIZZY_DATA = {
  ready: boolean;
  free: boolean;
};
