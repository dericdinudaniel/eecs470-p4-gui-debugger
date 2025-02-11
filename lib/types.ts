import { constantsStore as Constants } from "./constants-store";
// import { clog2 } from "./utils";
const clog2 = (x: number): number => Math.ceil(Math.log2(x));

// Word and register sizes
export type ADDR = number; // 32-bit address
export const ADDR_WIDTH = 32;

export type DATA = number; // 32-bit data
export const DATA_WIDTH = 32;

export type MEM_BLOCK = DATA[]; // 64-bit memory block
export const MEM_BLOCK_WIDTH = 64;

export type REG_IDX = number; // 5-bit register index
export const REG_IDX_WIDTH = 5;

// Calculating the bit-width for PHYS_REG_TAG based on clog2(PHYS_REG_SZ_R10K)
export type PHYS_REG_TAG = number;
export const PHYS_REG_TAG_WIDTH = clog2(Constants.get("PHYS_REG_SZ_R10K"));

// MEM_TAG is a 4-bit value
export type MEM_TAG = number; // 4-bit memory tag
export const MEM_TAG_WIDTH = 4;

// Enum-like structure for memory size
export enum MEM_SIZE {
  BYTE = 0x0,
  HALF = 0x1,
  WORD = 0x2,
  DOUBLE = 0x3,
}
export const MEM_SIZE_WIDTH = 2;

// Memory bus commands
export enum MEM_COMMAND {
  MEM_NONE = 0x0,
  MEM_LOAD = 0x1,
  MEM_STORE = 0x2,
}
export const MEM_COMMAND_WIDTH = 2;
export function getMemCommandName(memCommand: MEM_COMMAND): string {
  return MEM_COMMAND[memCommand] ? MEM_COMMAND[memCommand] : "XXX";
}

// ICACHE_TAG definition
export type ICACHE_TAG = {
  tags: number; // Equivalent to `logic [12 - ICACHE_LINE_BITS:0]`
  valid: boolean;
};
export const ICACHE_TAG_WIDTH = 12 - Constants.get("ICACHE_LINE_BITS") + 1 + 1;

export type SQ_IDX = number;
export const SQ_IDX_WIDTH = clog2(Constants.get("SQ_SZ") + Constants.get("N"));

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
export type INST = number;
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
  ALU_AUIPC = 0xa,
  ALU_LUI = 0xb,
}
export const ALU_FUNC_WIDTH = 4;
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
export const MULT_FUNC_WIDTH = 4;
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
export const BRANCH_FUNC_WIDTH = 4;
export function getBRFuncName(brFunc: BRANCH_FUNC): string {
  return BRANCH_FUNC[brFunc] ? BRANCH_FUNC[brFunc] : "XXX";
}

// store function
export enum STORE_FUNC {
  S_SB = 0b0000,
  S_SH = 0b0001,
  S_SW = 0b0010,
}
export const STORE_FUNC_WIDTH = 4;
export function getSTOREFuncName(storeFunc: STORE_FUNC): string {
  return STORE_FUNC[storeFunc] ? STORE_FUNC[storeFunc] : "XXX";
}

// load function
export enum LOAD_FUNC {
  L_LB = 0b0000,
  L_LH = 0b0001,
  L_LW = 0b0010,
  L_LBU = 0b0100,
  L_LHU = 0b0101,
}
export const LOAD_FUNC_WIDTH = 4;
export function getLOADFuncName(loadFunc: LOAD_FUNC): string {
  return LOAD_FUNC[loadFunc] ? LOAD_FUNC[loadFunc] : "XXX";
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
  bhr: string; // BRANCH_PRED_SZ bits
  predicted_direction: boolean;
  predicted_target: ADDR;
  uncond_branch: boolean;
  halt: boolean;
  illegal: boolean;
  csr_op: boolean;
  valid: boolean;
};
export const ID_EX_PACKET_WIDTH =
  INST_WIDTH + // inst
  2 * ADDR_WIDTH + // PC, NPC
  2 * DATA_WIDTH + // rs1_value, rs2_value
  ALU_OPA_SELECT_WIDTH + // opa_select
  ALU_OPB_SELECT_WIDTH + // opb_select
  REG_IDX_WIDTH + // dest_reg_idx
  ALU_FUNC_WIDTH + // alu_func
  4 * 1 + // mult, rd_mem, wr_mem, cond_branch
  Constants.get("BRANCH_PRED_SZ") + // bhr
  1 + // predicted_direction
  ADDR_WIDTH + // predicted_target
  1 + // uncond_branch
  4 * 1; // halt, illegal, csr_op, valid

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

export type FU_FUNC =
  | ALU_FUNC
  | MULT_FUNC
  | BRANCH_FUNC
  | STORE_FUNC
  | LOAD_FUNC;
export const FU_FUNC_WIDTH = 4;

export type FU_DATA = {
  T_new: PHYS_REG_TAG;
  rs1: DATA;
  rs2: DATA;
  valid: boolean;
  fu_func: FU_FUNC;
  b_mask: string;
  saved_tail: SQ_IDX;
  PC: ADDR;
  imm: DATA;
};
export const FU_DATA_WIDTH =
  PHYS_REG_TAG_WIDTH + // T_new
  DATA_WIDTH + // rs1
  DATA_WIDTH + // rs2
  1 + // valid
  FU_FUNC_WIDTH + // fu_func
  Constants.get("NUM_CHECKPOINTS") + // b_mask
  SQ_IDX_WIDTH + // saved_tail
  ADDR_WIDTH + // PC
  DATA_WIDTH; // imm

// Enum for operation types
export enum FU_TYPE {
  MUL,
  BR,
  ALU,
  LOAD,
  STORE,
}
export const FU_TYPE_WIDTH = 3;
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
  halt: boolean;
  store: boolean;
  branch: boolean;
  NPC: ADDR;
  packet: ID_EX_PACKET;
}
export const ROB_DATA_WIDTH =
  2 * PHYS_REG_TAG_WIDTH + // T_old, T_new
  REG_IDX_WIDTH + // R_dest
  5 * 1 + // valid, retireable, halt, store, branch
  ADDR_WIDTH + // NPC
  ID_EX_PACKET_WIDTH; // packet

// ready and free list. boolean for each physical register
export type FRIZZY_DATA = {
  ready: string[]; // 1 if ready
  free: string[]; // 1 if free
};
export const FRIZZY_DATA_WIDTH = 2 * Constants.get("PHYS_REG_SZ_R10K");

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
  PC: ADDR;
  saved_tail: SQ_IDX;
  packet: ID_EX_PACKET;
};
export const RS_TO_FU_DATA_WIDTH =
  3 * PHYS_REG_TAG_WIDTH + // T_new, T_a, T_b
  1 + // valid
  FU_FUNC_WIDTH + // fu_func
  1 + // has_imm
  DATA_WIDTH + // imm_value
  Constants.get("NUM_CHECKPOINTS") + // b_mask
  ADDR_WIDTH + // PC
  SQ_IDX_WIDTH + // saved_tail
  ID_EX_PACKET_WIDTH; // packet

// RS Data packet
export type RS_DATA = {
  occupied: boolean;
  fu: FU_TYPE;
  rs_to_fu_data: RS_TO_FU_DATA;
  ready_ta: boolean;
  ready_tb: boolean;
};
export const RS_DATA_WIDTH =
  1 + // occupied
  FU_TYPE_WIDTH + // fu
  RS_TO_FU_DATA_WIDTH + // rs_to_fu_data
  1 + // ready_ta
  1; // ready_tb

export enum BRANCH_PREDICT_T {
  NO_RESOLVE = 0b00,
  CORRECT_PRED = 0b01,
  MISPREDICT = 0b10,
}
export const BRANCH_PREDICT_T_WIDTH = 2;
export function getBranchPredictName(branchPredict: BRANCH_PREDICT_T): string {
  return BRANCH_PREDICT_T[branchPredict]
    ? BRANCH_PREDICT_T[branchPredict]
    : "XXX";
}

export type CHECKPOINT_DATA = {
  predicted_direction: boolean;
  predicted_target: ADDR;
  resolving_branch_direction: boolean;
  recovery_target: ADDR;
  branch_PC: ADDR;
  checkpointed_bhr: string; // BRANCH_PRED_SZ bits
  rob_tail: number; // width = clog2(ROB_SZ + N)
  sq_tail: SQ_IDX;
  frizzy_checkpoint: FRIZZY_DATA;
  map_checkpoint: PHYS_REG_TAG[]; // array of size AR_NUM
};
export const CHECKPOINT_DATA_WIDTH =
  1 + // predicted_direction
  ADDR_WIDTH + // predicted_target
  1 + // resolving_branch_direction
  ADDR_WIDTH + // recovery_target
  ADDR_WIDTH + // branch_PC
  Constants.get("BRANCH_PRED_SZ") + // checkpointed_bhr
  clog2(Constants.get("ROB_SZ") + Constants.get("N")) + // rob_tail
  SQ_IDX_WIDTH + // sq_tail
  FRIZZY_DATA_WIDTH + // frizzy_checkpoint
  Constants.get("AR_NUM") * PHYS_REG_TAG_WIDTH; // map_checkpoint

export type FU_TO_BS_DATA = {
  bmask: string;
  taken: boolean;
  is_jalr: boolean;
  target: ADDR;
};
export const FU_TO_BS_DATA_WIDTH =
  Constants.get("NUM_CHECKPOINTS") + // bmask
  1 + // taken
  1 + // is_jalr
  ADDR_WIDTH; // target

export enum PREDICTOR_STATE_T {
  ST,
  WT,
  WNT,
  SNT,
}
export const PREDICTOR_STATE_T_WIDTH = 2;
export function getPredictorStateName(
  predictorState: PREDICTOR_STATE_T
): string {
  return PREDICTOR_STATE_T[predictorState]
    ? PREDICTOR_STATE_T[predictorState]
    : "XXX";
}

// lsq stuff
export type SQ_DATA = {
  T_new: PHYS_REG_TAG;
  store_address: ADDR;
  store_type: STORE_FUNC;
  address_valid: boolean;
  store_data: DATA;
  valid: boolean;
  ready_mem: boolean;
};
export const SQ_DATA_WIDTH =
  PHYS_REG_TAG_WIDTH + // T_new
  ADDR_WIDTH + // store_address
  STORE_FUNC_WIDTH + // store_type
  1 + // address_valid
  DATA_WIDTH + // store_data
  1 + // valid
  1; // ready_mem

export type STR_CMPLT = {
  address_valid: boolean;
  index: number;
  store_address: ADDR;
  store_data: DATA;
};
export const STR_CMPLT_WIDTH =
  1 + // address_valid
  SQ_IDX_WIDTH + // index
  ADDR_WIDTH + // store_address
  DATA_WIDTH; // store_data

export type SQ_RETIRE = {
  valid: boolean;
  store_address: ADDR;
  store_data: DATA;
};
export const SQ_RETIRE_WIDTH = 1 + ADDR_WIDTH + DATA_WIDTH;

export type RS_ADDRESS_CHECK = {
  address_valid_req: boolean;
  saved_tail: SQ_IDX;
};
export const RS_ADDRESS_CHECK_WIDTH = 1 + SQ_IDX_WIDTH;

export type LOAF_FORWARD_REQ = {
  load_data_req: boolean;
  forwarding_address: ADDR;
  load_type: LOAD_FUNC;
  sq_tail: SQ_IDX;
};
export const LOAF_FORWARD_REQ_WIDTH =
  1 + // load_data_req
  ADDR_WIDTH + // forwarding_address
  LOAD_FUNC_WIDTH + // load_type
  SQ_IDX_WIDTH; // sq_tail

export type LOAF_FORWARD_RESULT = {
  forwarded_valid: boolean;
  stall_LOAF: boolean;
  forwarding_data: DATA;
};
export const LOAF_FORWARD_RESULT_WIDTH =
  1 + // forwarded_valid
  1 + // stall_LOAF
  DATA_WIDTH; // forwarding_data

// D Cache
export type DCACHE_TAG = {
  tags: number; // Equivalent to `logic [12 - DCACHE_LINE_BITS:0]`
  valid: boolean;
};
export const DCACHE_TAG_WIDTH = 12 - Constants.get("DCACHE_LINE_BITS") + 1 + 1;

export enum DCACHE_T {
  DCACHE_NONE,
  DCACHE_LOAD,
  DCACHE_STORE,
}
export const DCACHE_T_WIDTH = 2;
export function getDCacheTName(dcache: DCACHE_T): string {
  return DCACHE_T[dcache] ? DCACHE_T[dcache] : "XXX";
}

export enum MSHR_TYPE {
  INVALID,
  READ,
  WRITE,
}
export const MSHR_TYPE_WIDTH = 2;
export function getMSHRTypeName(mshrType: MSHR_TYPE): string {
  return MSHR_TYPE[mshrType] ? MSHR_TYPE[mshrType] : "XXX";
}

export type MSHR_DATA = {
  block_addr: number; // 14 bits
  data: MEM_BLOCK; // 64 bits
  bitmask: string; // 9 bits
  state: MSHR_TYPE;
};
export const MSHR_DATA_WIDTH =
  14 + // block_addr
  MEM_BLOCK_WIDTH + // data
  9 + // bitmask
  MSHR_TYPE_WIDTH; // state

export enum LOAF_STATE_T {
  RECEIVE,
  SQ_FORWARD,
  D_CACHE,
  CDB_ARB,
  FINISH,
}
export const LOAF_STATE_T_WIDTH = 3;
export function getLOAFStateName(loafState: LOAF_STATE_T): string {
  return LOAF_STATE_T[loafState] ? LOAF_STATE_T[loafState] : "XXX";
}
