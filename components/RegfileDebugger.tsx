import React, { useState } from "react";
import {
  extractSignalValue,
  parseRegfile,
  parseRegPortData,
  parseRegPortIdx,
  parseRegPortValid,
  displayValue,
  displayValueHex,
} from "@/lib/utils";
import { ScopeData } from "@/lib/tstypes";
import { chunkArray } from "@/lib/tsutils";
import {
  Dthead,
  Dtd,
  DtdLeft,
  Dth,
  DthLeft,
  Dtr,
  Dtbody,
  Dtable,
} from "@/components/dui/DTable";
import { Module, ModuleHeader, ModuleContent } from "./dui/Module";
import { DButton } from "./dui/DButton";
import { Card, CardContent, CardHeader } from "./dui/Card";
import * as Types from "@/lib/types";
import { constantsStore as Constants } from "@/lib/constants-store";
import { FU_Port } from "@/lib/tstypes";
import { useDisplayContext } from "./DisplayContext";

type RegfileDebuggerProps = {
  className: string;
  signalRegfile: ScopeData;
};

const DisplayRegPorts: React.FC<{
  tag: number;
  ports_idx: number[];
  ports_data: number[];
  ports_enable?: boolean[];
  idxForFwd: number[];
  enableForFwd: boolean[];
  FU_ports?: FU_Port[];
}> = ({
  tag,
  ports_idx,
  ports_data,
  ports_enable = Array(ports_idx.length).fill(false),
  idxForFwd,
  enableForFwd,
  FU_ports,
}) => {
  return (
    <Dtable>
      <Dthead>
        <Dtr>
          <DthLeft className="p-1">#</DthLeft>
          <Dth>Idx</Dth>
          <Dth className="w-20">Data</Dth>
          {FU_ports && <Dth>FU: #</Dth>}
        </Dtr>
      </Dthead>
      <Dtbody>
        {ports_idx.map((idx, port) => {
          let valid =
            ports_enable[port] ||
            (ports_idx[port] != 0 && !Number.isNaN(ports_idx[port]));
          let rowColor = valid ? "bg-good" : "bg-neutral";

          const fwd = idxForFwd.findIndex(
            (writePort) => writePort === ports_idx[port]
          );
          const fwdEnable = fwd >= 0 && enableForFwd[fwd];

          if (fwdEnable) {
            rowColor = "bg-veryGood";
          }

          const currentFU = FU_ports?.[port];

          return (
            <Dtr key={port} className={rowColor}>
              <DtdLeft className="font-semibold">{displayValue(port)}:</DtdLeft>
              <Dtd className={valid && tag == idx ? "bg-tagSearchHit" : ""}>
                {displayValue(idx)}
              </Dtd>
              <Dtd>{displayValueHex(ports_data[port])}</Dtd>
              {FU_ports && currentFU && (
                <Dtd>
                  {Types.getFUTypeName(currentFU.fu_type)}:{currentFU.idx}
                </Dtd>
              )}
            </Dtr>
          );
        })}
      </Dtbody>
    </Dtable>
  );
};

const RegfileDebugger: React.FC<RegfileDebuggerProps> = ({
  className,
  signalRegfile,
}) => {
  const registers = extractSignalValue(signalRegfile, "registers").value;
  const REG_registers = parseRegfile(registers);

  const chunkSize = 16;
  const regChunks = chunkArray(REG_registers, chunkSize);

  // ports
  const read_idx = extractSignalValue(signalRegfile, "read_idx").value;
  const write_idx = extractSignalValue(signalRegfile, "write_idx").value;

  const read_out = extractSignalValue(signalRegfile, "read_out").value;
  const write_data = extractSignalValue(signalRegfile, "write_data").value;
  const write_en = extractSignalValue(signalRegfile, "write_en").value;

  const Reg_read_idx = parseRegPortIdx(read_idx);
  const Reg_write_idx = parseRegPortIdx(write_idx);
  const Reg_write_en = parseRegPortValid(write_en);

  const Ref_read_out = parseRegPortData(read_out);
  const Ref_write_data = parseRegPortData(write_data);

  // calculate which ports are used by which FUs

  const FU_ReadPorts: FU_Port[] = [
    ...Array.from({ length: Constants.get("NUM_FU_ALU") * 2 }, (_, i) => ({
      fu_type: Types.FU_TYPE.ALU,
      idx: Math.floor(i / 2),
    })),
    ...Array.from({ length: Constants.get("NUM_FU_MULT") * 2 }, (_, i) => ({
      fu_type: Types.FU_TYPE.MUL,
      idx: Math.floor(i / 2),
    })),
    ...Array.from({ length: Constants.get("NUM_FU_BRANCH") * 2 }, (_, i) => ({
      fu_type: Types.FU_TYPE.BR,
      idx: Math.floor(i / 2),
    })),
    ...Array.from({ length: Constants.get("NUM_FU_STORE") * 2 }, (_, i) => ({
      fu_type: Types.FU_TYPE.STORE,
      idx: Math.floor(i / 2),
    })),
    ...Array.from({ length: Constants.get("NUM_FU_LOAD") * 2 }, (_, i) => ({
      fu_type: Types.FU_TYPE.LOAD,
      idx: Math.floor(i / 2),
    })),
  ];

  const { tag } = useDisplayContext();
  const [showRegfilePorts, setShowRegfilePorts] = useState(true);

  return (
    <>
      <Module className={className}>
        <ModuleHeader label="Physical Registers">
          <DButton
            className="ml-2"
            onClick={() => setShowRegfilePorts(!showRegfilePorts)}
          >
            {showRegfilePorts ? "Hide Regfile Ports" : "Show Regfile Ports"}
          </DButton>
        </ModuleHeader>

        <ModuleContent>
          {showRegfilePorts && (
            <Card className="flex space-x-2">
              {/* read ports */}
              <div className="justify-items-center">
                <h2 className="text-md font-semibold">Read Ports</h2>
                <DisplayRegPorts
                  tag={tag}
                  ports_idx={Reg_read_idx}
                  ports_data={Ref_read_out}
                  idxForFwd={Reg_write_idx}
                  enableForFwd={Reg_write_en}
                  FU_ports={FU_ReadPorts}
                />
              </div>

              {/* write ports */}
              <div className="justify-items-center">
                <h2 className="text-md font-semibold">Write Ports</h2>
                <DisplayRegPorts
                  tag={tag}
                  ports_idx={Reg_write_idx}
                  ports_data={Ref_write_data}
                  ports_enable={Reg_write_en}
                  idxForFwd={Reg_read_idx}
                  enableForFwd={Reg_read_idx.map((idx) => idx !== 0)}
                />
              </div>
            </Card>
          )}
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

                      return (
                        <Dtr key={globalIdx}>
                          <DtdLeft
                            className={`font-semibold ${
                              tag == globalIdx ? "bg-tagSearchHit" : ""
                            }`}
                          >
                            {prNumber}:
                          </DtdLeft>
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
