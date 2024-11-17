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
import { ModuleBase, ModuleHeader } from "./dui/Module";

type RegfileDebuggerProps = {
  className: string;
  signalRegfile: ScopeData;
};

const DisplayRegPorts: React.FC<{
  ports_idx: number[];
  ports_data: number[];
  ports_enable?: boolean[];
}> = ({
  ports_idx,
  ports_data,
  ports_enable = Array(ports_idx.length).fill(false),
}) => {
  return (
    <Dtable>
      <Dthead>
        <Dtr>
          <DthLeft className="p-1">Port #</DthLeft>
          <Dth>Idx</Dth>
          <Dth className="w-20">Data</Dth>
        </Dtr>
      </Dthead>
      <Dtbody>
        {ports_idx.map((idx, port) => {
          const rowColor =
            ports_enable[port] ||
            (ports_idx[port] != 0 && !Number.isNaN(ports_idx[port]))
              ? "bg-green-200"
              : "";

          return (
            <Dtr key={port} className={rowColor}>
              <DtdLeft className="font-semibold">{displayValue(port)}:</DtdLeft>
              <Dtd>{displayValue(idx)}</Dtd>
              <Dtd>{displayValueHex(ports_data[port])}</Dtd>
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

  const [showRegfilePorts, setShowRegfilePorts] = useState(true);
  const [showReg, setShowReg] = useState(true);

  return (
    <>
      <ModuleBase className={className}>
        <div className="justify-items-center">
          <div className="flex items-center">
            <ModuleHeader
              onClick={() => {
                setShowReg(!showReg);
              }}
            >
              Physical Registers
            </ModuleHeader>
            <button
              className="ml-4 bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600  text-xs mb-0"
              onClick={() => setShowRegfilePorts(!showRegfilePorts)}
            >
              {showRegfilePorts ? "Hide Regfile Ports" : "Show Regfile Ports"}
            </button>
          </div>

          {showReg && (
            <>
              <div className="flex space-x-2 mb-2">
                {showRegfilePorts && (
                  <>
                    {/* read ports */}
                    <div className="justify-items-center">
                      <h2 className="text-md font-semibold">Read Ports</h2>
                      <DisplayRegPorts
                        ports_idx={Reg_read_idx}
                        ports_data={Ref_read_out}
                      />
                    </div>

                    {/* write ports */}
                    <div className="justify-items-center">
                      <h2 className="text-md font-semibold">Write Ports</h2>
                      <DisplayRegPorts
                        ports_idx={Reg_write_idx}
                        ports_data={Ref_write_data}
                        ports_enable={Reg_write_en}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex space-x-1">
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
                            <Dtd className="font-semibold">{prNumber}:</Dtd>
                            <Dtd className="">{displayValueHex(value)}</Dtd>
                          </Dtr>
                        );
                      })}
                    </Dtbody>
                  </Dtable>
                ))}
              </div>
            </>
          )}
        </div>
      </ModuleBase>
    </>
  );
};

export default RegfileDebugger;
