import React, { useState } from "react";
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
  parseICACHE_TAG_List,
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
import { chunkArray, parseInstruction } from "@/lib/tsutils";
import PaddedNum from "./dui/PaddedNum";
import * as Types from "@/lib/types";
import { CardBase } from "./dui/Card";

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
    <CardBase className={className}>
      <h2 className="text-lg underline">Mem Inputs</h2>
      <div>
        <span className="font-semibold text-sm">Tran Tag: </span>
        <PaddedNum number={Imem2proc_transaction_tag} maxNumber={15} />
      </div>
      <div className="justify-items-center p-1">
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
                <Dtd>
                  <div className="w-40">{parseInstruction(inst)}</div>
                </Dtd>
              </Dtr>
            ))}
          </Dtbody>
        </Dtable>
      </div>
    </CardBase>
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
    <CardBase className={className}>
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
      <I$Request className="mt-2" signalI$={signalI$} />
    </CardBase>
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
    <CardBase className={className}>
      <h2 className="text-lg underline">Mem Outputs</h2>
      <div>
        <div>
          <span className="font-semibold text-sm">Command: </span>
          {Types.getMemCommandName(I$_proc2Imem_command)}
        </div>
        <div>
          <span className="font-semibold text-sm">Addr: </span>
          {displayValueHex(proc2Imem_addr)}
        </div>
      </div>
    </CardBase>
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
    <CardBase className={className}>
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
                <Dtd>
                  <div className="w-40">{parseInstruction(inst)}</div>
                </Dtd>
              </Dtr>
            ))}
          </Dtbody>
        </Dtable>
      </div>
    </CardBase>
  );
};

// The actual icache display
const I$Request: React.FC<{
  className: string;
  signalI$: ScopeData;
}> = ({ className, signalI$ }) => {
  const tags = extractSignalValue(signalI$, "tags").value;
  const indexes = extractSignalValue(signalI$, "indexes").value;
  const res = extractSignalValue(signalI$, "res").value;
  const Icache_valid = extractSignalValue(signalI$, "Icache_valid").value;
  const Icache_data = extractSignalValue(signalI$, "Icache_data").value;
  const I$_Icache_data = parse_to_INST_List(Icache_data);

  const I$_tags = parseI$_tags(tags);
  const I$_indexes = parseI$_indexes(indexes);
  const I$_res = parseBoolArrToBoolArray(res);
  const I$_Icache_valid = parseBoolArrToBoolArray(Icache_valid);

  return (
    <>
      <div className={`${className}`}>
        {/* the big table ig */}
        <div className="justify-items-center">
          <h2 className="font-semibold">I$ Req</h2>
          <Dtable>
            <Dthead>
              <Dtr>
                <Dth>Tag</Dth>
                <Dth>Index</Dth>
                <Dth>R EN</Dth>
                <Dth>Inst.</Dth>
              </Dtr>
            </Dthead>
            <Dtbody>
              {Array.from({ length: I$_tags.length }).map((_, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <Dtr
                      className={`${
                        I$_Icache_valid[idx] ? "bg-good" : "bg-bad"
                      }`}
                    >
                      <Dtd rowSpan={2} className="font-semibold text-base">
                        {displayValueHex(I$_tags[idx])}
                      </Dtd>
                      <Dtd rowSpan={2} className="font-semibold text-base">
                        {I$_indexes[idx]}
                      </Dtd>
                      <Dtd rowSpan={2} className="font-semibold text-base">
                        {I$_res[idx] ? "Yes" : "No"}
                      </Dtd>
                      <Dtd>
                        <div className="w-40">
                          {parseInstruction(I$_Icache_data[idx * 2])}
                        </div>
                      </Dtd>
                    </Dtr>
                    <Dtr
                      className={`${
                        I$_Icache_valid[idx] ? "bg-good" : "bg-bad"
                      }`}
                    >
                      <Dtd className="border-l">
                        <div className="w-40">
                          {parseInstruction(I$_Icache_data[idx * 2 + 1])}
                        </div>
                      </Dtd>
                    </Dtr>
                  </React.Fragment>
                );
              })}
            </Dtbody>
          </Dtable>
        </div>
      </div>
    </>
  );
};

const DisplayI$: React.FC<{
  className: string;
  signalI$: any;
}> = ({ className, signalI$ }) => {
  const icache_mem = signalI$.children.icache_mem as ScopeData;
  const memData = extractSignalValue(icache_mem, "memData").value;
  const I$_memData = parse_to_INST_List(memData);

  const icache_tags = extractSignalValue(signalI$, "icache_tags").value;
  const I$_icache_tags = parseICACHE_TAG_List(icache_tags);

  const chunkSize = 8; // Adjust the chunk size as needed
  const chunks = chunkArray(I$_icache_tags, chunkSize);

  const [showCache, setShowCache] = useState(true);

  return (
    <>
      <CardBase className={className}>
        <button
          className="font-semibold"
          onClick={() => {
            setShowCache(!showCache);
          }}
        >
          Actual Cache
        </button>
        {showCache && (
          <>
            <div className="flex space-x-1">
              {chunks.map((chunk, chunkIdx) => (
                <Dtable key={chunkIdx}>
                  <Dthead>
                    <Dtr>
                      <Dth className="px-2">#</Dth>
                      <Dth>Tag</Dth>
                      <Dth>Inst.</Dth>
                    </Dtr>
                  </Dthead>
                  <Dtbody>
                    {chunk.map((icache_tag, idx) => {
                      const tagIdx = chunkIdx * chunkSize + idx;
                      const tag = icache_tag.tags;
                      const valid = icache_tag.valid;
                      return (
                        <React.Fragment key={idx}>
                          <Dtr className={`${valid ? "bg-good" : "bg-bad"}`}>
                            <DtdLeft
                              rowSpan={2}
                              className="font-semibold text-base"
                            >
                              {tagIdx}:
                            </DtdLeft>
                            <Dtd
                              rowSpan={2}
                              className="font-semibold text-base"
                            >
                              {tag}
                            </Dtd>
                            <Dtd>
                              <div className="w-40">
                                {parseInstruction(I$_memData[tagIdx * 2])}
                              </div>
                            </Dtd>
                          </Dtr>
                          <Dtr className={`${valid ? "bg-good" : "bg-bad"}`}>
                            <Dtd className="border-l">
                              <div className="w-40">
                                {parseInstruction(I$_memData[tagIdx * 2 + 1])}
                              </div>
                            </Dtd>
                          </Dtr>
                        </React.Fragment>
                      );
                    })}
                  </Dtbody>
                </Dtable>
              ))}
            </div>
          </>
        )}
      </CardBase>
    </>
  );
};

// Main I$Debugger Component
type I$DebuggerProps = {
  className: string;
  signalI$: ScopeData;
};

const I$Debugger: React.FC<I$DebuggerProps> = ({ className, signalI$ }) => {
  const [showI$, setShowI$] = useState(true);

  return (
    <>
      <ModuleBase className={className}>
        <ModuleHeader
          className="mb-1"
          onClick={() => {
            setShowI$(!showI$);
          }}
        >
          I-Cache
        </ModuleHeader>

        {showI$ && (
          <>
            <div className="justify-items-center space-y-2">
              <div className="flex gap-x-3 items-start">
                <div className="space-y-1">
                  <MemInputs className="" signalI$={signalI$} />
                  <MemOutputs className="" signalI$={signalI$} />
                </div>

                <div className="flex space-x-1 items-start">
                  <FetchInputs className="" signalI$={signalI$} />
                  <FetchOutputs className="" signalI$={signalI$} />
                </div>
              </div>

              <DisplayI$ className="" signalI$={signalI$} />
            </div>
          </>
        )}
      </ModuleBase>
    </>
  );
};

export default I$Debugger;
