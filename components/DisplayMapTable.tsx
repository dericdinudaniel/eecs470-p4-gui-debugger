import React from "react";
import * as Constants from "@/lib/constants";
import { chunkArray } from "@/lib/tsutils";
import { displayValue } from "@/lib/utils";

type DisplayMapTableProps = {
  className: string;
  mapTable: number[];
};

const DisplayMapTable: React.FC<DisplayMapTableProps> = ({
  className,
  mapTable,
}) => {
  const chunkSize = 16; // Adjust the chunk size as needed
  const mapTableChunks = chunkArray(mapTable, chunkSize);

  return (
    <div className={`justify-items-center ${className}`}>
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
                  <th className="text-sm p-1">AR#</th>
                  <th className="text-sm border-l ROB-border-color p-1">PR#</th>
                </tr>
              </thead>
              <tbody>
                {chunk.map((pr, idx) => (
                  <tr key={chunkIdx * chunkSize + idx} className="bg-gray-200">
                    <td className="text-right text-sm border-t ROB-border-color font-semibold">
                      {chunkIdx * chunkSize + idx}:
                    </td>
                    <td className=" text-sm border-l border-t ROB-border-color">
                      <div className="text-center">
                        <span>{displayValue(pr)}</span>
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
