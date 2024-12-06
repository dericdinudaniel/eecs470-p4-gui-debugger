import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import { ScopeData } from "@/lib/tstypes";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parseMEM_BLOCK,
  parseMEM_COMMAND,
} from "@/lib/utils";
import { Card, CardContent, CardHeader, CardHeaderSmall } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";
import { getMemCommandName } from "@/lib/types";
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
import * as Types from "@/lib/types";
import {
  MemArbToI$,
  I$ToMemArb,
  MemToMemArb,
  MemArbToMem,
} from "./DisplayInterfaces";

type MemDebuggerProps = {
  className: string;
  signalCPU: ScopeData;
  signalMem: ScopeData;
  signalMemArb: ScopeData;
};

// D$ Interface Component
const D$IF: React.FC<{
  className: string;
  signalMemArb: ScopeData;
  display: boolean;
}> = ({ className, signalMemArb, display }) => {
  // inputs
  const Dcache2mem_command = extractSignalValueToInt(
    signalMemArb,
    "Dcache2mem_command"
  ) as Types.MEM_COMMAND;
  const Dcache2mem_addr = extractSignalValueToInt(
    signalMemArb,
    "Dcache2mem_addr"
  ) as Types.ADDR;
  const Dcache2mem_data = extractSignalValue(
    signalMemArb,
    "Dcache2mem_data"
  ).value;
  const MA_Dcache2mem_data = parseMEM_BLOCK(Dcache2mem_data);

  // outputs
  const mem2Dcache_transaction_tag = extractSignalValueToInt(
    signalMemArb,
    "mem2Dcache_transaction_tag"
  );
  const mem2Dcache_data = extractSignalValue(
    signalMemArb,
    "mem2Dcache_data"
  ).value;
  const D$_mem2Dcache_data = parseMEM_BLOCK(mem2Dcache_data);
  const mem2Dcache_data_tag = extractSignalValueToInt(
    signalMemArb,
    "mem2Dcache_data_tag"
  );

  return (
    <>
      <Card className={className} display={display}>
        <CardHeader label="D$IF" />
        <CardContent className="flex gap-x-3">
          {/* inputs */}
          <div className="justify-items-center">
            <CardHeaderSmall label="Inputs" />
            <div className="justify-items-center">
              <h2 className="font-semibold text-sm">
                {getMemCommandName(Dcache2mem_command)}
              </h2>
              <SimpleValDisplay label="Addr: ">
                {displayValueHex(Dcache2mem_addr)}
              </SimpleValDisplay>
              <Dtable>
                <Dthead>
                  <Dtr>
                    <Dth>Data</Dth>
                  </Dtr>
                </Dthead>
                <Dtbody
                  className={
                    Dcache2mem_command != Types.MEM_COMMAND.MEM_NONE
                      ? "bg-good"
                      : "bg-bad"
                  }
                >
                  <Dtr>
                    <Dtd>
                      <div className="w-20">
                        {displayValueHex(MA_Dcache2mem_data[0])}
                      </div>
                    </Dtd>
                  </Dtr>
                  <Dtr>
                    <Dtd>
                      <div className="w-20">
                        {displayValueHex(MA_Dcache2mem_data[1])}
                      </div>
                    </Dtd>
                  </Dtr>
                </Dtbody>
              </Dtable>
            </div>
          </div>

          {/* outputs */}
          <div className="justify-items-center">
            <CardHeaderSmall label="Outputs" />
            <div className="justify-items-center">
              <SimpleValDisplay label="Trans. Tag: ">
                {displayValue(mem2Dcache_transaction_tag)}
              </SimpleValDisplay>
              <Dtable>
                <Dthead>
                  <Dtr>
                    <DthLeft>Tag</DthLeft>
                    <Dth>Data</Dth>
                  </Dtr>
                </Dthead>
                <Dtbody
                  className={mem2Dcache_data_tag != 0 ? "bg-good" : "bg-bad"}
                >
                  <Dtr>
                    <Dtd rowSpan={2}>{displayValue(mem2Dcache_data_tag)}</Dtd>
                    <Dtd>
                      <div className="w-20"> {D$_mem2Dcache_data[0]}</div>
                    </Dtd>
                  </Dtr>
                  <Dtr>
                    <Dtd className="border-l">
                      <div className="w-20"> {D$_mem2Dcache_data[1]}</div>
                    </Dtd>
                  </Dtr>
                </Dtbody>
              </Dtable>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

// I$ Interface Component
const I$IF: React.FC<{
  className: string;
  signalMemArb: ScopeData;
  display: boolean;
}> = ({ className, signalMemArb, display }) => {
  // inputs
  const Icache2mem_command = extractSignalValueToInt(
    signalMemArb,
    "Icache2mem_command"
  ) as Types.MEM_COMMAND;
  const Icache2mem_addr = extractSignalValueToInt(
    signalMemArb,
    "Icache2mem_addr"
  ) as Types.ADDR;

  // outputs
  const mem2Icache_transaction_tag = extractSignalValueToInt(
    signalMemArb,
    "mem2Icache_transaction_tag"
  );
  const mem2Icache_data = extractSignalValue(
    signalMemArb,
    "mem2Icache_data"
  ).value;
  const MA_mem2Icache_data = parseMEM_BLOCK(mem2Icache_data);
  const mem2Icache_data_tag = extractSignalValueToInt(
    signalMemArb,
    "mem2Icache_data_tag"
  );

  return (
    <>
      <Card className={className} display={display}>
        <CardHeader label="I$IF" />
        <CardContent className="flex gap-x-3">
          <I$ToMemArb
            type="input"
            className=""
            memCommand={Icache2mem_command}
            memAddr={Icache2mem_addr}
          />

          <MemArbToI$
            type="output"
            className=""
            transTag={mem2Icache_transaction_tag}
            dataTag={mem2Icache_data_tag}
            data={MA_mem2Icache_data}
          />
        </CardContent>
      </Card>
    </>
  );
};

// Mem Interface Component
const MemIF: React.FC<{
  className: string;
  signalMemArb: ScopeData;
  display: boolean;
}> = ({ className, signalMemArb, display }) => {
  // inputs
  const proc2mem_command = extractSignalValueToInt(
    signalMemArb,
    "proc2mem_command"
  ) as Types.MEM_COMMAND;
  const proc2mem_addr = extractSignalValueToInt(
    signalMemArb,
    "proc2mem_addr"
  ) as Types.ADDR;
  const proc2mem_data = extractSignalValue(signalMemArb, "proc2mem_data").value;
  const MA_proc2mem_data = parseMEM_BLOCK(proc2mem_data);

  // outputs
  const mem2proc_transaction_tag = extractSignalValueToInt(
    signalMemArb,
    "mem2proc_transaction_tag"
  );
  const mem2proc_data = extractSignalValue(signalMemArb, "mem2proc_data").value;
  const MA_mem2Icache_data = parseMEM_BLOCK(mem2proc_data);
  const mem2proc_data_tag = extractSignalValueToInt(
    signalMemArb,
    "mem2proc_data_tag"
  );
  return (
    <>
      <Card>
        <CardContent className="flex gap-x-2">
          <MemToMemArb
            type="output"
            className=""
            transTag={mem2proc_transaction_tag}
            dataTag={mem2proc_data_tag}
            data={MA_mem2Icache_data}
          />
          <MemArbToMem
            type="input"
            className=""
            memCommand={proc2mem_command}
            memAddr={proc2mem_addr}
            memBlock={MA_proc2mem_data}
          />
        </CardContent>
      </Card>
    </>
  );
};

const MemDebugger: React.FC<MemDebuggerProps> = ({
  className,
  signalMem,
  signalMemArb,
}) => {
  return (
    <>
      <Module className={className}>
        <ModuleHeader label="Memory"></ModuleHeader>
        <ModuleContent className="space-y-2">
          <div className="flex items-start gap-x-2">
            <D$IF className="" signalMemArb={signalMemArb} display={true} />
            <I$IF className="" signalMemArb={signalMemArb} display={true} />
          </div>
          <div>
            <MemIF className="" signalMemArb={signalMemArb} display={true} />
          </div>
        </ModuleContent>
      </Module>
    </>
  );
};

export default MemDebugger;
