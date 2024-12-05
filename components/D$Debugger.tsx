import React from "react";
import {
  displayValueHex,
  extractSignalValue,
  extractSignalValueToBool,
  extractSignalValueToInt,
  parseADDR_List,
  parseBoolArrToBoolArray,
  parseDCACHE_TAG_List,
  parseMEM_BLOCK_List,
  parseMEM_COMMAND,
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
                    <Dth>Inst.</Dth>
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

// Main D$Debugger Component
type D$DebuggerProps = {
  className: string;
  signalD$: ScopeData;
};
const D$Debugger: React.FC<D$DebuggerProps> = ({ className, signalD$ }) => {
  return (
    <>
      <Module>
        <ModuleHeader label="D$ Debugger" />
        <ModuleContent>
          <DisplayD$ className="" signalD$={signalD$} />
        </ModuleContent>
      </Module>
    </>
  );
};
export default D$Debugger;
