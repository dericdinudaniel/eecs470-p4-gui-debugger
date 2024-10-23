import { clog2 } from "./utils";

// Architectural registers
export const AR_NUM = 32; // number of architectural registers

// Superscalar width
export const N = 3;
export const CDB_SZ = N; // This MUST match your superscalar width

// Sizes
export const ROB_SZ = 7;
export const RS_SZ = NaN; // Replace `NaN` with the appropriate value
export const PHYS_REG_SZ_P6 = 32;
export const PHYS_REG_SZ_R10K = 32 + ROB_SZ;

// worry about these later
export const BRANCH_PRED_SZ = NaN; // Replace `NaN` with the appropriate value
export const LSQ_SZ = NaN; // Replace `NaN` with the appropriate value

// Functional Units
export const NUM_FU_ALU = 2;
export const NUM_FU_MULT = 1;
export const NUM_FU_LOAD = 0;
export const NUM_FU_STORE = 0;
export const NUM_FU_BRANCH = 1;

export const NUM_FU =
  NUM_FU_ALU + NUM_FU_MULT + NUM_FU_LOAD + NUM_FU_STORE + NUM_FU_BRANCH;

// Number of multiplication stages
export const MULT_STAGES = 4;

export const FALSE = 0; // boolean false
export const TRUE = 1; // boolean true

export const REG_IDX_WIDTH = 5;

// Zero Register
export const ZERO_REG = 0; // equivalent of 5'd0 in SystemVerilog

// Basic NOP instruction
export const NOP = 0x00000013; // Equivalent of 32'h00000013 in SystemVerilog

// Memory tags
export const NUM_MEM_TAGS = 15;

// ICache definitions
export const ICACHE_LINES = 32;
export const ICACHE_LINE_BITS = clog2(ICACHE_LINES);

// Memory specifications
export const MEM_SIZE_IN_BYTES = 64 * 1024;
export const MEM_64BIT_LINES = MEM_SIZE_IN_BYTES / 8;

// Memory latency in cycles
// export const CLOCK_PERIOD          = 10.0; // in ns
// export const MEM_LATENCY_IN_CYCLES = Math.floor(100.0 / CLOCK_PERIOD + 0.49999);
