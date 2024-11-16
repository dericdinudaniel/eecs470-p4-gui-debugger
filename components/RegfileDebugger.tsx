import React, { useState } from "react";
import {
  clog2,
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
import * as Constants from "@/lib/constants";

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
    <div className="overflow-hidden rounded-lg border table-border-color">
      <table className="border-collapse">
        <thead>
          <tr className="bg-slate-300">
            <th className="text-sm p-1">Port #</th>
            <th className="text-sm border-l table-border-color p-1">Idx</th>
            <th className="text-sm border-l table-border-color p-1 w-20">
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {ports_idx.map((idx, port) => {
            const rowColor =
              ports_enable[port] ||
              (ports_idx[port] != 0 && !Number.isNaN(ports_idx[port]))
                ? "bg-green-200"
                : "";

            return (
              <tr key={port} className={rowColor}>
                <td className="text-right text-sm border-t table-border-color font-semibold">
                  {displayValue(port)}:
                </td>
                <td className="text-center text-sm border-l border-t table-border-color">
                  {displayValue(idx)}
                </td>
                <td className="text-center text-sm border-l border-t table-border-color">
                  {displayValueHex(ports_data[port])}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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

  return (
    <>
      <div
        className={`${className} inline-flex flex-col items-center bg-gray-500/[.15] rounded-lg p-3 shadow-lg`}
      >
        <div className="justify-items-center">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Physical Registers</h2>
            <button
              className="ml-4 bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600  text-xs mb-0"
              onClick={() => setShowRegfilePorts(!showRegfilePorts)}
            >
              {showRegfilePorts ? "Hide Regfile Ports" : "Show Regfile Ports"}
            </button>
          </div>
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
              <div
                key={chunkIdx}
                className="mb-4 overflow-hidden rounded-lg border table-border-color"
              >
                <table>
                  <thead>
                    <tr className="bg-slate-300">
                      <th className="text-sm p-1">#</th>
                      <th className="text-sm p-1 border-l table-border-color w-20">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {regChunk.map((reg_data, idx) => {
                      const globalIdx = chunkIdx * chunkSize + idx;
                      const prNumber = globalIdx.toString();
                      const value = regChunk[idx];

                      return (
                        <tr key={globalIdx} className="bg-gray-200">
                          <td className="text-center text-sm border-t table-border-color font-semibold">
                            {prNumber}:
                          </td>
                          <td className="text-center text-sm border-t border-l table-border-color">
                            {displayValueHex(value)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RegfileDebugger;
