import React from "react";
import {
  displayValueHex,
  extractSignalValue,
  extractSignalValueToBool,
  extractSignalValueToInt,
  parse_to_INST_List,
  parseADDR_List,
  parseBoolArrToBoolArray,
  parseI$_indexes,
  parseI$_tags,
  parseMEM_COMMAND,
} from "@/lib/utils";
import { ScopeData } from "@/lib/tstypes";
import { ModuleBase, ModuleHeader } from "./dui/Module";
import {
  Dthead,
  Dtd,
  DtdLeft,
  Dtr,
  Dth,
  DthLeft,
  Dtbody,
  Dtable,
} from "@/components/dui/DTable";
import { parseInstruction } from "@/lib/tsutils";
import PaddedNum from "./dui/PaddedNum";
import { getMemCommandName } from "@/lib/types";

// Memory Inputs Component
const MemInputs: React.FC<{
  className: string;
  signalI$: ScopeData;
}> = ({ className, signalI$ }) => {
  const Imem2proc_transaction_tag = extractSignalValueToInt(
    signalI$,
    "Imem2proc_transaction_tag"
  );
  const Imem2proc_data_tag = extractSignalValueToInt(
    signalI$,
    "Imem2proc_data_tag"
  );
  const Imem2proc_data = extractSignalValue(signalI$, "Imem2proc_data").value;
  const I$_Imem2proc_data = parse_to_INST_List(Imem2proc_data);

  return (
    <div
      className={`justify-items-center border rounded-lg p-1 bg-card-foreground ${className}`}
    >
      <h2 className="text-lg underline">Mem Inputs</h2>
      <div>
        <span className="font-semibold text-sm">Tran Tag: </span>
        <PaddedNum number={Imem2proc_transaction_tag} maxNumber={15} />
      </div>
      <div className="justify-items-center border rounded-lg p-1">
        <span className="font-semibold text-sm">Data Tag: </span>
        <PaddedNum number={Imem2proc_data_tag} maxNumber={15} />
        <Dtable>
          <Dthead>
            <Dtr>
              <Dth colSpan={2}>Insts.</Dth>
            </Dtr>
          </Dthead>
          <Dtbody>
            {I$_Imem2proc_data.map((inst, idx) => (
              <Dtr key={idx} className="bg-neutral">
                <Dtd className="px-1">{parseInstruction(inst)}</Dtd>
              </Dtr>
            ))}
          </Dtbody>
        </Dtable>
      </div>
    </div>
  );
};

// Fetch Inputs Component
const FetchInputs: React.FC<{
  className: string;
  signalI$: ScopeData;
}> = ({ className, signalI$ }) => {
  const proc2Icache_addr = extractSignalValue(
    signalI$,
    "proc2Icache_addr"
  ).value;
  const I$_proc2Icache_addr = parseADDR_List(proc2Icache_addr);
  const valid_fetches = extractSignalValueToInt(signalI$, "valid_fetches");
  const take_branch = extractSignalValueToBool(signalI$, "take_branch");

  return (
    <div
      className={`justify-items-center border rounded-lg p-1 bg-card-foreground ${className}`}
    >
      <h2 className="text-lg underline">Fetch Inputs</h2>
      <div className="justify-items-center">
        <div>
          <span className="font-semibold text-sm">Take Branch: </span>
          {take_branch ? "Yes" : "No"}
        </div>
        <div>
          <span className="font-semibold text-sm">Valid Fetches: </span>
          <PaddedNum
            number={valid_fetches}
            maxNumber={I$_proc2Icache_addr.length}
          />
        </div>
      </div>
      <Dtable>
        <Dthead>
          <Dtr>
            <Dth colSpan={2}>Addresses</Dth>
          </Dtr>
        </Dthead>
        <Dtbody className="bg-neutral">
          {I$_proc2Icache_addr.map((addr, idx) => (
            <Dtr key={idx}>
              <DtdLeft className="font-semibold pl-1">{idx}:</DtdLeft>
              <Dtd className="w-20 text-sm">{displayValueHex(addr)}</Dtd>
            </Dtr>
          ))}
        </Dtbody>
      </Dtable>
    </div>
  );
};

// Memory Outputs Component
const MemOutputs: React.FC<{
  className: string;
  signalI$: ScopeData;
}> = ({ className, signalI$ }) => {
  const proc2Imem_command = extractSignalValue(
    signalI$,
    "proc2Imem_command"
  ).value;
  const I$_proc2Imem_command = parseMEM_COMMAND(proc2Imem_command);
  const proc2Imem_addr = extractSignalValueToInt(signalI$, "proc2Imem_addr");

  return (
    <div
      className={`justify-items-center border rounded-lg p-1 bg-card-foreground ${className}`}
    >
      <h2 className="text-lg underline">Mem Outputs</h2>
      <div>
        <div>
          <span className="font-semibold text-sm">Command: </span>
          {getMemCommandName(I$_proc2Imem_command)}
        </div>
        <div>
          <span className="font-semibold text-sm">Addr: </span>
          {displayValueHex(proc2Imem_addr)}
        </div>
      </div>
    </div>
  );
};

// Fetch Outputs Component
const FetchOutputs: React.FC<{
  className: string;
  signalI$: ScopeData;
}> = ({ className, signalI$ }) => {
  const Icache_data_out = extractSignalValue(signalI$, "Icache_data_out").value;
  const I$_Icache_data_out = parse_to_INST_List(Icache_data_out);
  const Icache_valid_out = extractSignalValueToInt(
    signalI$,
    "Icache_valid_out"
  );

  return (
    <div
      className={`justify-items-center border rounded-lg p-1 bg-card-foreground ${className}`}
    >
      <h2 className="text-lg underline">Fetch Outputs</h2>
      <div className="justify-items-center">
        <div>
          <span className="font-semibold text-sm">Valid: </span>
          {Icache_valid_out}
        </div>
        <Dtable>
          <Dthead>
            <Dtr>
              <Dth colSpan={2}>Insts.</Dth>
            </Dtr>
          </Dthead>
          <Dtbody>
            {I$_Icache_data_out.map((inst, idx) => (
              <Dtr key={idx} className="text-sm p-1 bg-neutral">
                <Dtd className="px-1">{parseInstruction(inst)}</Dtd>
              </Dtr>
            ))}
          </Dtbody>
        </Dtable>
      </div>
    </div>
  );
};

// The actual icache display
const DispayI$: React.FC<{
  className: string;
  signalI$: ScopeData;
}> = ({ className, signalI$ }) => {
  const tags = extractSignalValue(signalI$, "tags").value;
  const indexes = extractSignalValue(signalI$, "indexes").value;
  const res = extractSignalValue(signalI$, "res").value;
  const Icache_valid = extractSignalValue(signalI$, "Icache_valid").value;
  const Icache_data = extractSignalValue(signalI$, "Icache_data").value;

  const I$_tags = parseI$_tags(tags);
  const I$_indexes = parseI$_indexes(indexes);
  const I$_res = parseBoolArrToBoolArray(res);
  const I$_Icache_valid = parseBoolArrToBoolArray(Icache_valid);

  return (
    <>
      <div className={`${className}`}>
        {/* the big table ig */}
        <div>
          <Dtable>
            <Dthead>
              <Dtr>
                <DthLeft>#</DthLeft>
                <Dth>Tag</Dth>
                <Dth>Index</Dth>
                <Dth>Res</Dth>
              </Dtr>
            </Dthead>
            <Dtbody>
              {Array.from({ length: I$_tags.length }).map((_, idx) => {
                return (
                  <Dtr
                    key={idx}
                    className={`${I$_Icache_valid[idx] ? "bg-good" : "bg-bad"}`}
                  >
                    <DtdLeft className="font-semibold">{idx}:</DtdLeft>
                    <Dtd>{I$_tags[idx]}</Dtd>
                    <Dtd>{I$_indexes[idx]}</Dtd>
                    <Dtd>{I$_res[idx] ? "Yes" : "No"}</Dtd>
                  </Dtr>
                );
              })}
            </Dtbody>
          </Dtable>
        </div>
      </div>
    </>
  );
};

// Main I$Debugger Component
type I$DebuggerProps = {
  className: string;
  signalI$: ScopeData;
};

const I$Debugger: React.FC<I$DebuggerProps> = ({ className, signalI$ }) => {
  return (
    <>
      <ModuleBase className={className}>
        <ModuleHeader className="mb-1">I-Cache</ModuleHeader>
        <div className="justify-items-center">
          <div className="flex gap-x-2 items-start">
            <MemInputs className="" signalI$={signalI$} />
            <FetchInputs className="" signalI$={signalI$} />
          </div>

          <DispayI$ className="my-3" signalI$={signalI$} />

          <div className="flex gap-x-2 items-start">
            <MemOutputs className="" signalI$={signalI$} />
            <FetchOutputs className="" signalI$={signalI$} />
          </div>
        </div>
      </ModuleBase>
    </>
  );
};

export default I$Debugger;
