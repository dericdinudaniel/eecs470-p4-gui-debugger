import * as Constants from "./constants";
// import { clog2 } from "./utils";
const clog2 = (x: number): number => Math.ceil(Math.log2(x));

// Word and register sizes
export type ADDR = number; // 32-bit address
export const ADDR_WIDTH = 32;

export type DATA = number; // 32-bit data
export const DATA_WIDTH = 32;

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
export const MEM_SIZE_WIDTH = clog2(
  Object.keys(MEM_SIZE).filter((k) => isNaN(Number(k))).length
);

// Memory bus commands
export enum MEM_COMMAND {
  MEM_NONE = 0x0,
  MEM_LOAD = 0x1,
  MEM_STORE = 0x2,
}
export const MEM_COMMAND_WIDTH = clog2(
  Object.keys(MEM_COMMAND).filter((k) => isNaN(Number(k))).length
);

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
export const EXCEPTION_CODE_WIDTH = clog2(
  Object.keys(EXCEPTION_CODE).filter((k) => isNaN(Number(k))).length
);

// Representation of RISC-V instruction types
export type INST = {
  inst: number; // 32-bit instruction
  itype: string; // Type of instruction

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
export const INST_WIDTH = 32;

// ALU operand A input select
export enum ALU_OPA_SELECT {
  OPA_IS_RS1 = 0x0,
  OPA_IS_NPC = 0x1,
  OPA_IS_PC = 0x2,
  OPA_IS_ZERO = 0x3,
}
export const ALU_OPA_SELECT_WIDTH = 2;

// ALU operand B input select
export enum ALU_OPB_SELECT {
  OPB_IS_RS2 = 0x0,
  OPB_IS_I_IMM = 0x1,
  OPB_IS_S_IMM = 0x2,
  OPB_IS_B_IMM = 0x3,
  OPB_IS_U_IMM = 0x4,
  OPB_IS_J_IMM = 0x5,
}
export const ALU_OPB_SELECT_WIDTH = 4;

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
export const ALU_FUNC_WIDTH = clog2(
  Object.keys(ALU_FUNC).filter((k) => isNaN(Number(k))).length
);
export function getALUFuncName(aluFunc: ALU_FUNC): string {
  return ALU_FUNC[aluFunc] ? ALU_FUNC[aluFunc] : "XXX";
}

// MULT funct3 code
export enum MULT_FUNC {
  M_MUL = 0x0,
  M_MULH = 0x1,
  M_MULHSU = 0x2,
  M_MULHU = 0x3,
}
export const MULT_FUNC_WIDTH = clog2(
  Object.keys(MULT_FUNC).filter((k) => isNaN(Number(k))).length
);
export function getMULFuncName(mulFunc: MULT_FUNC): string {
  return MULT_FUNC[mulFunc] ? MULT_FUNC[mulFunc] : "XXX";
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
export const BRANCH_FUNC_WIDTH = clog2(
  Object.keys(BRANCH_FUNC).filter((k) => isNaN(Number(k))).length
);
export function getBRFuncName(brFunc: BRANCH_FUNC): string {
  return BRANCH_FUNC[brFunc] ? BRANCH_FUNC[brFunc] : "XXX";
}

// IF_ID Packet
export type IF_ID_PACKET = {
  inst: INST;
  PC: ADDR;
  NPC: ADDR;
  valid: boolean;
};
export const IF_ID_PACKET_WIDTH = INST_WIDTH + 2 * ADDR_WIDTH + 1;

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
export const ID_EX_PACKET_WIDTH =
  INST_WIDTH +
  2 * ADDR_WIDTH +
  2 * DATA_WIDTH +
  ALU_OPA_SELECT_WIDTH +
  ALU_OPB_SELECT_WIDTH +
  REG_IDX_WIDTH +
  ALU_FUNC_WIDTH +
  9 * 1;

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
export const EX_MEM_PACKET_WIDTH =
  DATA_WIDTH +
  ADDR_WIDTH +
  1 + // take_branch
  DATA_WIDTH +
  1 + // rd_mem
  1 + // wr_mem
  REG_IDX_WIDTH +
  1 + // halt
  1 + // illegal
  1 + // csr_op
  1 + // rd_unsigned
  MEM_SIZE_WIDTH +
  1; // valid

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
export const MEM_WB_PACKET_WIDTH =
  DATA_WIDTH + ADDR_WIDTH + REG_IDX_WIDTH + 1 + 1 + 1 + 1;

// COMMIT Packet
export type COMMIT_PACKET = {
  NPC: ADDR;
  data: DATA;
  reg_idx: REG_IDX;
  halt: boolean;
  illegal: boolean;
  valid: boolean;
};
export const COMMIT_PACKET_WIDTH =
  ADDR_WIDTH + DATA_WIDTH + REG_IDX_WIDTH + 1 + 1 + 1;

// MULT data
export type MULT_DATA = {
  T_new: PHYS_REG_TAG;
  rs1: DATA;
  rs2: DATA;
  valid: boolean;
  func: MULT_FUNC;
};
export const MULT_DATA_WIDTH =
  PHYS_REG_TAG_WIDTH + DATA_WIDTH + DATA_WIDTH + MULT_FUNC_WIDTH + 1;

// ALU data
export type ALU_DATA = {
  T_new: PHYS_REG_TAG;
  rs1: DATA;
  rs2: DATA;
  valid: boolean;
  func: ALU_FUNC;
};
export const ALU_DATA_WIDTH =
  PHYS_REG_TAG_WIDTH + DATA_WIDTH + DATA_WIDTH + ALU_FUNC_WIDTH + 1;

// BRANCH data
export type BRANCH_DATA = {
  T_new: PHYS_REG_TAG;
  rs1: DATA;
  rs2: DATA;
  valid: boolean;
  func: BRANCH_FUNC;
};
export const BRANCH_DATA_WIDTH =
  PHYS_REG_TAG_WIDTH + DATA_WIDTH + DATA_WIDTH + BRANCH_FUNC_WIDTH + 1;

export type FU_FUNC = ALU_FUNC | MULT_FUNC | BRANCH_FUNC;
export const FU_FUNC_WIDTH = 4;
// export const FU_FUNC_WIDTH = Math.max(
//   ALU_FUNC_WIDTH,
//   MULT_FUNC_WIDTH,
//   BRANCH_FUNC_WIDTH
// );

// FU_DATA union type, which can contain ALU_DATA, MULT_DATA, or BRANCH_DATA
export type FU_DATA =
  | { fu_type: FU_TYPE.MUL; data: MULT_DATA }
  | { fu_type: FU_TYPE.BR; data: BRANCH_DATA }
  | { fu_type: FU_TYPE.ALU; data: ALU_DATA };
export const FU_DATA_WIDTH = Math.max(
  MULT_DATA_WIDTH,
  BRANCH_DATA_WIDTH,
  ALU_DATA_WIDTH
);

// Enum for operation types
export enum FU_TYPE {
  MUL,
  BR,
  ALU,
  MEM,
}
export const FU_TYPE_WIDTH = 2;
export function getFUTypeName(fuType: FU_TYPE): string {
  return FU_TYPE[fuType] ? FU_TYPE[fuType] : "XXX";
}

// ROB Data packet
export interface ROB_DATA {
  T_old: PHYS_REG_TAG;
  T_new: PHYS_REG_TAG;
  R_dest: REG_IDX;
  valid: boolean;
  retireable: boolean;
  packet: ID_EX_PACKET;
}
export const ROB_DATA_WIDTH =
  2 * PHYS_REG_TAG_WIDTH + REG_IDX_WIDTH + 2 + ID_EX_PACKET_WIDTH;

// RS Data packet
export type RS_DATA = {
  occupied: boolean;
  fu: FU_TYPE;
  fu_func: FU_FUNC;
  T_new: PHYS_REG_TAG;
  T_a: PHYS_REG_TAG;
  ready_ta: boolean;
  T_b: PHYS_REG_TAG;
  ready_tb: boolean;
  has_imm: boolean;
  imm_value: DATA;
  b_mask: string;
  predicted: boolean;
  packet: ID_EX_PACKET;
};
export const RS_DATA_WIDTH =
  1 + // occupied
  FU_TYPE_WIDTH + // fu
  FU_FUNC_WIDTH + // fu_func
  2 * PHYS_REG_TAG_WIDTH + // T_new, T_a
  1 + // ready_ta
  PHYS_REG_TAG_WIDTH + // T_b
  1 + // ready_tb
  1 + // has_imm
  DATA_WIDTH + // imm_value
  Constants.NUM_CHECKPOINTS + // b_mask
  1 + // predicted
  ID_EX_PACKET_WIDTH; // packet

// ready and free list. boolean for each physical register
export type FRIZZY_DATA = {
  ready: string[]; // 1 if ready
  free: string[]; // 1 if free
};
export const FRIZZY_DATA_WIDTH = 2 * Constants.PHYS_REG_SZ_R10K;

// FRIZZY Data packet
export type FREDDY_IN = {
  R_dest: REG_IDX;
  R_a: REG_IDX;
  R_b: REG_IDX;
};
export const FREDDY_IN_WIDTH = 3 * REG_IDX_WIDTH;

export type FREDDY_OUT = {
  T_new: PHYS_REG_TAG;
  T_old: PHYS_REG_TAG;
  T_a: PHYS_REG_TAG;
  ready_ta: boolean;
  T_b: PHYS_REG_TAG;
  ready_tb: boolean;
};
export const FREDDY_OUT_WIDTH = 4 * PHYS_REG_TAG_WIDTH + 2;

export type RS_TO_FU_DATA = {
  T_new: PHYS_REG_TAG;
  T_a: PHYS_REG_TAG;
  T_b: PHYS_REG_TAG;
  valid: boolean;
  fu_func: FU_FUNC;
  has_imm: boolean;
  imm_value: DATA;
  b_mask: string;
  predicted: boolean;
  packet: ID_EX_PACKET;
};
export const RS_TO_FU_DATA_WIDTH =
  3 * PHYS_REG_TAG_WIDTH + // T_new, T_a, T_b
  1 + // valid
  FU_FUNC_WIDTH + // fu_func
  1 + // has_imm
  DATA_WIDTH + // imm_value
  Constants.NUM_CHECKPOINTS + // b_mask
  1 + // predicted
  ID_EX_PACKET_WIDTH; // packet

export enum BRANCH_PREDICT_T {
  NOT_RESOLVING = 0b00,
  CORRECTLY_PREDICTED = 0b01,
  MISPREDICTED = 0b10,
}
export const BRANCH_PREDICT_T_WIDTH = 2;

export type CHECKPOINT_DATA = {
  pc_checkpoint: ADDR;
  bhr_checkpoint: boolean[]; // BRANCH_PRED_SZ bits
  rob_tail: number; // width = clog2(ROB_SZ + N)
  frizzy_checkpoint: FRIZZY_DATA;
  map_checkpoint: PHYS_REG_TAG[]; // array of size AR_NUM
};
export const CHECKPOINT_DATA_WIDTH =
  ADDR_WIDTH +
  Constants.BRANCH_PRED_SZ +
  clog2(Constants.ROB_SZ + Constants.N) +
  FRIZZY_DATA_WIDTH +
  Constants.AR_NUM * PHYS_REG_TAG_WIDTH;
