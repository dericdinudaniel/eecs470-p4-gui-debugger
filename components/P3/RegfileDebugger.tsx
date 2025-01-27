import { ScopeData } from "@/lib/tstypes";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToInt,
  parse_to_INST_List,
  parseID_EX_PACKET_orig,
  parseIF_ID_PACKET,
  parseRegfile,
} from "@/lib/utils";
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
import { Module, ModuleHeader, ModuleContent } from "../dui/Module";
import { Card, CardHeader, CardContent, CardHeaderSmall } from "../dui/Card";
import { SimpleValDisplay } from "../dui/SimpleValDisplay";
import { chunkArray, parseInstruction } from "@/lib/tsutils";
import DisplayIF_ID_PACKET from "./DisplayIF_ID_PACKET";

type RegfileDebuggerProps = {
  className: string;
  signalReg: ScopeData;
};

const RegfileDebugger: React.FC<RegfileDebuggerProps> = ({
  className,
  signalReg,
}) => {
  const read_idx_1 = extractSignalValueToInt(signalReg, "read_idx_1");
  const read_idx_2 = extractSignalValueToInt(signalReg, "read_idx_2");
  const write_idx = extractSignalValueToInt(signalReg, "write_idx");
  const write_en = extractSignalValueToInt(signalReg, "write_en");
  const write_data = extractSignalValueToInt(signalReg, "write_data");

  const read_out_1 = extractSignalValueToInt(signalReg, "read_out_1");
  const read_out_2 = extractSignalValueToInt(signalReg, "read_out_2");

  // regfile
  const registers = extractSignalValue(signalReg, "registers").value;
  const REG_registers = parseRegfile(registers);
  // add an empty register to the beginning
  REG_registers.unshift(0);

  const chunkSize = 8;
  const regChunks = chunkArray(REG_registers, chunkSize);

  return (
    <>
      <Module>
        <ModuleHeader label="Regfile" />
        <ModuleContent>
          <Card className="mt-2">
            <CardHeader label="Registers" className="text-sm no-underline" />
            <CardContent className="flex space-x-1 mt-1">
              {regChunks.map((regChunk, chunkIdx) => (
                <Dtable key={chunkIdx}>
                  <Dthead>
                    <Dtr>
                      <Dth className="text-sm p-1">#</Dth>
                      <Dth className="text-sm p-1 w-20">Value</Dth>
                    </Dtr>
                  </Dthead>
                  <Dtbody>
                    {regChunk.map((reg_data, idx) => {
                      const globalIdx = chunkIdx * chunkSize + idx;
                      const prNumber = globalIdx.toString();
                      const value = regChunk[idx];

                      if (globalIdx == 0) {
                        return (
                          <Dtr key={globalIdx} className="bg-bad">
                            <DtdLeft></DtdLeft>
                            <Dtd>zero reg</Dtd>
                          </Dtr>
                        );
                      }

                      return (
                        <Dtr key={globalIdx} className="bg-neutral">
                          <DtdLeft>{prNumber}:</DtdLeft>
                          <Dtd className="">{displayValueHex(value)}</Dtd>
                        </Dtr>
                      );
                    })}
                  </Dtbody>
                </Dtable>
              ))}
            </CardContent>
          </Card>
        </ModuleContent>
      </Module>
    </>
  );
};

export default RegfileDebugger;
