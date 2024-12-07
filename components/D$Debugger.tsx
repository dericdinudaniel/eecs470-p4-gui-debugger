import React, { useState } from "react";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToBool,
  extractSignalValueToInt,
  parseADDR_List,
  parseBoolArrToBoolArray,
  parseDCACHE_TAG_List,
  parseMEM_BLOCK,
  parseMEM_BLOCK_List,
  parseMEM_COMMAND,
  parseMSHR_DATA_List,
} from "@/lib/utils";
import { ScopeData } from "@/lib/tstypes";
import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
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
import { chunkArray } from "@/lib/tsutils";
import PaddedNum from "./dui/PaddedNum";
import * as Types from "@/lib/types";
import { Card, CardContent, CardHeader, CardHeaderSmall } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";
import { getDCacheTName, getMemCommandName } from "@/lib/types";
import { DButton } from "./dui/DButton";

// Memory Interface Component
const MemIF: React.FC<{
  className: string;
  signalD$: ScopeData;
  display: boolean;
}> = ({ className, signalD$, display }) => {
  // inputs
  const Dmem2proc_transaction_tag = extractSignalValueToInt(
    signalD$,
    "Dmem2proc_transaction_tag"
  );
  const Dmem2proc_data = extractSignalValue(signalD$, "Dmem2proc_data").value;
  const D$_Dmem2proc_data = parseMEM_BLOCK(Dmem2proc_data);
  const Dmem2proc_data_tag = extractSignalValueToInt(
    signalD$,
    "Dmem2proc_data_tag"
  );

  // outputs
  const proc2Dmem_command = extractSignalValueToInt(
    signalD$,
    "proc2Dmem_command"
  ) as Types.MEM_COMMAND;
  const proc2Dmem_addr = extractSignalValueToInt(
    signalD$,
    "proc2Dmem_addr"
  ) as Types.ADDR;
  const proc2Dmem_data = extractSignalValue(signalD$, "proc2Dmem_data").value;
  const D$_proc2Dmem_data = parseMEM_BLOCK(proc2Dmem_data);

  return (
    <>
      <Card className={className} display={display}>
        <CardHeader label="Mem IF" />
        <CardContent className="flex gap-x-3">
          {/* inputs */}
          <div className="justify-items-center">
            <CardHeaderSmall label="Inputs" />
            <SimpleValDisplay label="Trans. Tag: ">
              {displayValue(Dmem2proc_transaction_tag)}
            </SimpleValDisplay>
            <Dtable>
              <Dthead>
                <Dtr>
                  <DthLeft>Tag</DthLeft>
                  <Dth>Data</Dth>
                </Dtr>
              </Dthead>
              <Dtbody
                className={Dmem2proc_data_tag != 0 ? "bg-good" : "bg-bad"}
              >
                <Dtr>
                  <Dtd rowSpan={2}>{displayValue(Dmem2proc_data_tag)}</Dtd>
                  <Dtd>
                    <div className="w-20"> {D$_Dmem2proc_data[0]}</div>
                  </Dtd>
                </Dtr>
                <Dtr>
                  <Dtd className="border-l">
                    <div className="w-20"> {D$_Dmem2proc_data[1]}</div>
                  </Dtd>
                </Dtr>
              </Dtbody>
            </Dtable>
          </div>

          {/* outputs */}
          <div className="justify-items-center">
            <CardHeaderSmall label="Outputs" />
            <h2 className="font-semibold text-sm">
              {getMemCommandName(proc2Dmem_command)}
            </h2>
            <SimpleValDisplay label="Addr: ">
              {displayValueHex(proc2Dmem_addr)}
            </SimpleValDisplay>
            <Dtable>
              <Dthead>
                <Dtr>
                  <Dth>Data</Dth>
                </Dtr>
              </Dthead>
              <Dtbody
                className={
                  proc2Dmem_command != Types.MEM_COMMAND.MEM_NONE
                    ? "bg-good"
                    : "bg-bad"
                }
              >
                <Dtr>
                  <Dtd>
                    <div className="w-20">
                      {displayValueHex(D$_proc2Dmem_data[0])}
                    </div>
                  </Dtd>
                </Dtr>
                <Dtr>
                  <Dtd>
                    <div className="w-20">
                      {displayValueHex(D$_proc2Dmem_data[1])}
                    </div>
                  </Dtd>
                </Dtr>
              </Dtbody>
            </Dtable>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

//LSArb Interface Component
const LSArbIF: React.FC<{
  className: string;
  signalD$: ScopeData;
  display: boolean;
}> = ({ className, signalD$, display }) => {
  // inputs
  const Dcache_type = extractSignalValueToInt(
    signalD$,
    "Dcache_type"
  ) as Types.DCACHE_T;
  const proc2Dcache_addr = extractSignalValueToInt(
    signalD$,
    "proc2Dcache_addr"
  ) as Types.ADDR;
  const proc2Dcache_size = extractSignalValueToInt(
    signalD$,
    "proc2Dcache_size"
  ) as Types.MEM_SIZE;
  const proc2Dcache_data = extractSignalValue(
    signalD$,
    "proc2Dcache_data"
  ).value;
  const D$_proc2Dcache_data = parseMEM_BLOCK(proc2Dcache_data);

  // outputs
  const Dcache_data_out = extractSignalValue(signalD$, "Dcache_data_out").value;
  const D$_Dcache_data_out = parseMEM_BLOCK(Dcache_data_out);
  const Dcache_valid_out = extractSignalValueToBool(
    signalD$,
    "Dcache_valid_out"
  );
  const Dcache2proc_addr = extractSignalValueToInt(
    signalD$,
    "Dcache2proc_addr"
  ) as Types.ADDR;
  const Dcache2proc_arbiter = extractSignalValueToInt(
    signalD$,
    "Dcache2proc_arbiter"
  );

  return (
    <>
      <Card className={className} display={display}>
        <CardHeader label="LS Arb IF" />
        <CardContent className="flex gap-x-3">
          {/* inputs */}
          <div className="justify-items-center">
            <CardHeaderSmall label="Inputs" />
            <h2 className="font-semibold text-sm">
              {getDCacheTName(Dcache_type)}
            </h2>
            <SimpleValDisplay label="Addr: ">
              {displayValueHex(proc2Dcache_addr)}
            </SimpleValDisplay>
            <Dtable>
              <Dthead>
                <Dtr>
                  <Dth>Data</Dth>
                </Dtr>
              </Dthead>
              <Dtbody
                className={
                  Dcache_type != Types.DCACHE_T.DCACHE_NONE
                    ? "bg-good"
                    : "bg-bad"
                }
              >
                <Dtr>
                  <Dtd>
                    <div className="w-20">
                      {displayValueHex(D$_proc2Dcache_data[0])}
                    </div>
                  </Dtd>
                </Dtr>
                <Dtr>
                  <Dtd>
                    <div className="w-20">
                      {displayValueHex(D$_proc2Dcache_data[0])}
                    </div>
                  </Dtd>
                </Dtr>
              </Dtbody>
            </Dtable>
          </div>

          {/* outputs */}
          <div className="justify-items-center">
            <CardHeaderSmall label="Outputs" />
            <div
              className="justify-items-center space-y-[-.35rem] mt-[-.2rem]" //ik this is bad style but i had to line it up
            >
              <SimpleValDisplay label="Arb Addr: ">
                {displayValueHex(Dcache2proc_arbiter)}
              </SimpleValDisplay>
              <SimpleValDisplay label="Addr: ">
                {displayValueHex(Dcache2proc_addr)}
              </SimpleValDisplay>
            </div>
            <Dtable className="">
              <Dthead>
                <Dtr>
                  <Dth>Data</Dth>
                </Dtr>
              </Dthead>
              <Dtbody className={Dcache_valid_out ? "bg-good" : "bg-bad"}>
                <Dtr>
                  <Dtd>
                    <div className="w-20">
                      {displayValueHex(D$_Dcache_data_out[0])}
                    </div>
                  </Dtd>
                </Dtr>
                <Dtr>
                  <Dtd>
                    <div className="w-20">
                      {displayValueHex(D$_Dcache_data_out[1])}
                    </div>
                  </Dtd>
                </Dtr>
              </Dtbody>
            </Dtable>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const DisplayD$: React.FC<{
  className: string;
  signalD$: any;
}> = ({ className, signalD$ }) => {
  const Dcache_mem = signalD$.children.Dcache_mem as ScopeData;
  const memData = extractSignalValue(Dcache_mem, "memData").value;
  const D$_memData = parseMEM_BLOCK_List(memData);

  const Dcache_tags = extractSignalValue(signalD$, "Dcache_tags").value;
  const D$_Dcache_tags = parseDCACHE_TAG_List(Dcache_tags);

  const chunkSize = 8; // Adjust the chunk size as needed
  const chunks = chunkArray(D$_Dcache_tags, chunkSize);

  return (
    <>
      <Card className={className}>
        <CardHeader label="Actual DCache" />
        <CardContent>
          <div className="flex space-x-1">
            {chunks.map((chunk, chunkIdx) => (
              <Dtable key={chunkIdx}>
                <Dthead>
                  <Dtr>
                    <Dth className="px-2">#</Dth>
                    <Dth>Tag</Dth>
                    <Dth>Data</Dth>
                  </Dtr>
                </Dthead>
                <Dtbody>
                  {chunk.map((dcache_tag, idx) => {
                    const tagIdx = chunkIdx * chunkSize + idx;
                    const tag = dcache_tag.tags;
                    const valid = dcache_tag.valid;
                    return (
                      <React.Fragment key={idx}>
                        <Dtr className={`${valid ? "bg-good" : "bg-bad"}`}>
                          <DtdLeft
                            rowSpan={2}
                            className="font-semibold text-base"
                          >
                            {tagIdx}:
                          </DtdLeft>
                          <Dtd rowSpan={2} className="font-semibold text-base">
                            {tag}
                          </Dtd>
                          <Dtd>
                            <div className="w-20">
                              {displayValueHex(D$_memData[tagIdx][0])}
                            </div>
                          </Dtd>
                        </Dtr>
                        <Dtr className={`${valid ? "bg-good" : "bg-bad"}`}>
                          <Dtd className="border-l">
                            <div className="w-20">
                              {displayValueHex(D$_memData[tagIdx][1])}
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
        </CardContent>
      </Card>
    </>
  );
};

const DisplayMSHRs: React.FC<{
  className: string;
  signalD$: any;
}> = ({ className, signalD$ }) => {
  const mshr = extractSignalValue(signalD$, "mshr").value;
  const D$_mshr = parseMSHR_DATA_List(mshr);

  return (
    <>
      <Card>
        <CardHeader label="MSHRs" />
        <CardContent>
          <Dtable>
            <Dthead>
              <Dtr>
                <Dth>#</Dth>
                <Dth>
                  <div className="w-20">Blk Addr</div>
                </Dth>
                <Dth>
                  <div className="w-16">Bitmask</div>
                </Dth>
                <Dth>Data</Dth>
                <Dth>
                  <div className="w-14">State</div>
                </Dth>
              </Dtr>
            </Dthead>
            <Dtbody>
              {D$_mshr.map((mshr, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <Dtr
                      className={
                        mshr.state != Types.MSHR_TYPE.INVALID
                          ? "bg-good"
                          : "bg-bad"
                      }
                    >
                      <DtdLeft rowSpan={2} className="font-semibold text-base">
                        {idx}:
                      </DtdLeft>
                      <Dtd rowSpan={2} className="font-semibold text-base">
                        {displayValueHex(mshr.block_addr)}
                      </Dtd>
                      <Dtd rowSpan={2}>{mshr.bitmask}</Dtd>
                      <Dtd>
                        <div className="w-20">
                          {displayValueHex(mshr.data[0])}
                        </div>
                      </Dtd>
                      <Dtd rowSpan={2}>{Types.getMSHRTypeName(mshr.state)}</Dtd>
                    </Dtr>
                    <Dtr
                      className={
                        mshr.state != Types.MSHR_TYPE.INVALID
                          ? "bg-good"
                          : "bg-bad"
                      }
                    >
                      <Dtd className="border-l">
                        <div className="w-20">
                          {displayValueHex(mshr.data[1])}
                        </div>
                      </Dtd>
                    </Dtr>
                  </React.Fragment>
                );
              })}
            </Dtbody>
          </Dtable>
        </CardContent>
      </Card>
    </>
  );
};

// Main D$Debugger Component
type D$DebuggerProps = {
  className: string;
  signalD$: ScopeData;
};
const D$Debugger: React.FC<D$DebuggerProps> = ({ className, signalD$ }) => {
  const [showD$Interfaces, setShowD$Interfaces] = useState(true);

  return (
    <>
      <Module className={className}>
        <ModuleHeader label="D-Cache">
          {/* Toggle buttons */}
          <div className="pl-3 space-x-2">
            <DButton onClick={() => setShowD$Interfaces(!showD$Interfaces)}>
              {showD$Interfaces ? "Hide D$ Interfaces" : "Show D$ Interfaces"}
            </DButton>
          </div>
        </ModuleHeader>
        <ModuleContent className="space-y-2">
          <div className="flex justify-items-center gap-x-2 items-start ">
            <DisplayMSHRs className="" signalD$={signalD$} />
            <div className="space-y-2 justify-items-center">
              <DisplayD$ className="" signalD$={signalD$} />
              <div className="flex justify-items-center gap-x-2 items-start ">
                <MemIF
                  className=""
                  signalD$={signalD$}
                  display={showD$Interfaces}
                />
                <LSArbIF
                  className=""
                  signalD$={signalD$}
                  display={showD$Interfaces}
                />
              </div>
            </div>
          </div>
        </ModuleContent>
      </Module>
    </>
  );
};
export default D$Debugger;
