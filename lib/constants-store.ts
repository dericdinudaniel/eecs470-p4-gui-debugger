// constants-store.ts
type Subscriber = () => void;
type DependencyFn = (store: Record<string, number>) => number;

class ConstantsStore {
  private store: Record<string, number> = {};
  private dependencies: Record<string, DependencyFn> = {};
  private subscribers: Set<Subscriber> = new Set();

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
    // Initialize with default values
    this.store = { ...this.initialStore };

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
  }

  reset(): void {
    this.store = { ...this.initialStore };
    this.updateDependencies();
    this.notifySubscribers();
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
}

// Export a singleton instance
export const constantsStore = new ConstantsStore();

// React hook for components
import { useState, useEffect } from "react";

export function useConstantsStore() {
  const [constants, setConstants] = useState(constantsStore.getAll());

  useEffect(() => {
    return constantsStore.subscribe(() => {
      setConstants(constantsStore.getAll());
    });
  }, []);

  return {
    constants,
    setConstant: (key: string, value: number) => constantsStore.set(key, value),
    resetConstants: () => constantsStore.reset(),
  };
}
