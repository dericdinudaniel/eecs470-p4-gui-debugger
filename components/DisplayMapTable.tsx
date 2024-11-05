import React from "react";
import * as Constants from "@/lib/constants";
import { chunkArray } from "@/lib/tsutils";

type DisplayMapTableProps = {
  className: string;
  mapTable: number[];
  readyBits: string[];
};

const DisplayMapTable: React.FC<DisplayMapTableProps> = ({
  className,
  mapTable,
  readyBits,
}) => {
  const chunkSize = 16; // Adjust the chunk size as needed
  const mapTableChunks = chunkArray(mapTable, chunkSize);

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <h2 className="text-lg font-semibold">Map Table</h2>
      <div className="flex space-x-1">
        {mapTableChunks.map((chunk, chunkIdx) => (
          <div
            key={chunkIdx}
            className="overflow-hidden rounded-lg border ROB-border-color mb-2"
          >
            <table className="border-collapse">
              <thead>
                <tr className="bg-slate-300">
                  <th className="text-sm p-2">AR#</th>
                  <th className="text-sm border-l ROB-border-color p-2">PR#</th>
                </tr>
              </thead>
              <tbody>
                {chunk.map((pr, idx) => (
                  <tr
                    key={chunkIdx * chunkSize + idx}
                    className={`${
                      readyBits[pr] === "1" ? "bg-green-200" : "bg-gray-200"
                    }`}
                  >
                    <td className="text-right text-sm border-t ROB-border-color font-semibold">
                      {chunkIdx * chunkSize + idx}:
                    </td>
                    <td className=" text-sm border-l border-t ROB-border-color">
                      <div className="flex  px-3 space-x-1">
                        <span className="w-4">{pr}</span>
                        <span className="flex items-center">
                          {readyBits[pr] === "1" ? "+" : "\u00A0"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayMapTable;
