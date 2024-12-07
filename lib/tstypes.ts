import * as Types from "./types";

export type SignalType = {
  sigType: string;
  width: number;
};

export type SignalData = {
  name: string;
  type: SignalType;
  value: string;
};

export type ScopeData = {
  [key: string]: SignalData | { children: ScopeData };
};

export type FU_Port = { fu_type: Types.FU_TYPE; idx: number };
