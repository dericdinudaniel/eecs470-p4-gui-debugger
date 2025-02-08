// constants-store.ts
import { useState, useEffect } from "react";
import {
  extractSignalValue,
  parseCDBTags,
  parseFU_DATA_List,
  parseSQ_DATA_List,
} from "./utils";
import * as Types from "./types";
import { toast } from "sonner";

type Subscriber = () => void;
type DependencyFn = (store: Record<string, number>) => number;

class ConstantsStore {
  private store: Record<string, number> = {};
  private dependencies: Record<string, DependencyFn> = {};
  private subscribers: Set<Subscriber> = new Set();
  private localStorageKey = "constantsStore";

  private initialStore: Record<string, number> = {
    AR_NUM: 32,
    N: 8,
    CDB_SZ: 8,
    ROB_SZ: 32,
    RS_SZ: 16,
    PHYS_REG_SZ_P6: 32,
    PHYS_REG_SZ_R10K: 64,
    BRANCH_PRED_SZ: 3,
    SQ_SZ: 8,
    NUM_FU_ALU: 3,
    NUM_FU_MULT: 2,
    NUM_FU_LOAD: 3,
    NUM_FU_STORE: 3,
    NUM_FU_BRANCH: 1,
    NUM_FU: 12,
    MULT_STAGES: 4,
    FALSE: 0,
    TRUE: 1,
    ZERO_REG: 0,
    NOP: 0x00000013,
    NUM_MEM_TAGS: 15,
    ICACHE_LINES: 32,
    ICACHE_LINE_BITS: 5,
    DCACHE_LINES: 32,
    DCACHE_LINE_BITS: 5,
    MEM_SIZE_IN_BYTES: 64 * 1024,
    MEM_64BIT_LINES: (64 * 1024) / 8,
    READ_PORTS: 24,
    WRITE_PORTS: 8,
    NUM_CHECKPOINTS: 4,
  };

  constructor() {
    // Initialize with default values or load from local storage
    this.loadFromLocalStorage();

    // Set up dependencies
    this.setDependency("CDB_SZ", (store) => store.N);
    this.setDependency("PHYS_REG_SZ_R10K", (store) => 32 + store.ROB_SZ);
    this.setDependency(
      "NUM_FU",
      (store) =>
        store.NUM_FU_ALU +
        store.NUM_FU_MULT +
        store.NUM_FU_LOAD +
        store.NUM_FU_STORE +
        store.NUM_FU_BRANCH
    );
    this.setDependency("READ_PORTS", (store) => 2 * store.NUM_FU);
    this.setDependency("WRITE_PORTS", (store) => store.N);
    this.setDependency(
      "MEM_64BIT_LINES",
      (store) => store.MEM_SIZE_IN_BYTES / 8
    );
  }

  get(key: string): number {
    return this.store[key];
  }

  getAll(): Record<string, number> {
    return { ...this.store };
  }

  set(key: string, value: number): void {
    this.store[key] = value;
    this.updateDependencies();
    this.notifySubscribers();
    this.saveToLocalStorage();
  }

  reset(): void {
    this.store = { ...this.initialStore };
    this.updateDependencies();
    this.notifySubscribers();
    this.saveToLocalStorage();

    console.log("Resetting constants: ", this.store);
    toast.success("Constants reset", {
      description: "All constants have been reset to their default values",
    });
  }

  autoDetectConstants(signalData: any): void {
    // Some constants cannot be auto-detected due to lack of information and need to be infered from other signals before rendering.
    // For example, store queue index width is dependant on store queue size, and SQ idx width affects other stuff I don't remember rn.
    // But most of the time, constants can be infered from the signal data if the Verilog struct is constant size. Notice how I don't do this for every single constant.

    // base signals
    const testbench = signalData?.signals.children.testbench;
    const cpu = testbench?.children.mustafa;
    const Front_End = cpu?.children.Front_End;
    const OoO_Core = cpu?.children.OoO_Core;

    // modules
    const signalRS = OoO_Core.children.DUT_rs;
    const signalFU = OoO_Core.children.DUT_fu;
    const signalSQ = OoO_Core.children.DUT_sq;
    const signalBPred = Front_End.children.masonshare;

    // auto detect N
    const early_cdb = extractSignalValue(signalRS, "early_cdb").value;
    const RS_early_cdb = parseCDBTags(early_cdb);
    const N = RS_early_cdb.length;
    constantsStore.set("N", N);

    // auto detect NUM_FUs
    const alu_data = extractSignalValue(signalFU, "alu_data").value;
    const mult_data = extractSignalValue(signalFU, "mult_data").value;
    const branch_data = extractSignalValue(signalFU, "branch_data").value;
    const load_data = extractSignalValue(signalFU, "load_data").value;
    const store_data = extractSignalValue(signalFU, "store_data").value;
    const FU_alu_data = parseFU_DATA_List(alu_data, Types.FU_TYPE.ALU);
    const FU_mult_data = parseFU_DATA_List(mult_data, Types.FU_TYPE.MUL);
    const FU_branch_data = parseFU_DATA_List(branch_data, Types.FU_TYPE.BR);
    const FU_load_data = parseFU_DATA_List(load_data, Types.FU_TYPE.LOAD);
    const FU_store_data = parseFU_DATA_List(store_data, Types.FU_TYPE.STORE);
    const NUM_FU_ALU = FU_alu_data.length;
    const NUM_FU_MULT = FU_mult_data.length;
    const NUM_FU_BRANCH = FU_branch_data.length;
    const NUM_FU_LOAD = FU_load_data.length;
    const NUM_FU_STORE = FU_store_data.length;
    constantsStore.set("NUM_FU_ALU", NUM_FU_ALU);
    constantsStore.set("NUM_FU_MULT", NUM_FU_MULT);
    constantsStore.set("NUM_FU_BRANCH", NUM_FU_BRANCH);
    constantsStore.set("NUM_FU_LOAD", NUM_FU_LOAD);
    constantsStore.set("NUM_FU_STORE", NUM_FU_STORE);

    // auto detect SQ_SZ
    const sq_entries = extractSignalValue(signalSQ, "entries").value;
    const SQ_entries = parseSQ_DATA_List(sq_entries);
    const SQ_SZ = SQ_entries.length;
    constantsStore.set("SQ_SZ", SQ_SZ);

    // auto detect BRANCH_PRED_SZ
    const bhr = extractSignalValue(signalBPred, "bhr").value;
    const BRANCH_PRED_SZ = bhr.length - 1;
    constantsStore.set("BRANCH_PRED_SZ", BRANCH_PRED_SZ);

    console.log("Auto Detecting Constants: ", constantsStore.getAll());
    toast.success("Constants auto-detected", {
      description: "All constants have been auto-detected from signal data",
    });
  }

  setDependency(key: string, fn: DependencyFn): void {
    this.dependencies[key] = fn;
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private updateDependencies(): void {
    let hasChanges = true;
    while (hasChanges) {
      hasChanges = false;
      for (const [key, fn] of Object.entries(this.dependencies)) {
        const newValue = fn(this.store);
        if (this.store[key] !== newValue) {
          this.store[key] = newValue;
          hasChanges = true;
        }
      }
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback());
  }

  private saveToLocalStorage(): void {
    if (typeof window === "undefined") return; // Skip during SSR
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.store));
    } catch (error) {
      console.error("Failed to save to local storage:", error);
    }
  }

  private loadFromLocalStorage(): void {
    if (typeof window === "undefined") return; // Skip during SSR
    try {
      const storedData = localStorage.getItem(this.localStorageKey);
      if (storedData) {
        this.store = JSON.parse(storedData);
        this.updateDependencies();
      } else {
        this.store = { ...this.initialStore };
      }
    } catch (error) {
      console.error("Failed to load from local storage:", error);
      this.store = { ...this.initialStore };
    }
  }
}

// Export a singleton instance
export const constantsStore = new ConstantsStore();

// React hook for components
export function useConstantsStore() {
  const [constants, setConstants] = useState(constantsStore.getAll());

  useEffect(() => {
    const unsubscribe = constantsStore.subscribe(() => {
      setConstants(constantsStore.getAll());
    });
    return unsubscribe;
  }, []);

  return {
    constants,
    setConstant: (key: string, value: number) => constantsStore.set(key, value),
    resetConstants: () => constantsStore.reset(),
    autoDetectConstants: (signalData: any) =>
      constantsStore.autoDetectConstants(signalData),
  };
}
