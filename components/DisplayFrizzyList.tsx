import React from "react";
import * as Constants from "@/lib/constants";
import { chunkArray } from "@/lib/tsutils";

type DisplayFrizzyListProps = {
  className: string;
  freeList: string[];
  readyBits: string[];
};

const DisplayFrizzyList: React.FC<DisplayFrizzyListProps> = ({
  className,
  freeList,
  readyBits,
}) => {
  if (freeList.length !== readyBits.length) {
    return <div>Invalid free list and ready bits</div>;
  }

  const chunkSize = 16;
  const freeListChunks = chunkArray(freeList, chunkSize);
  const readyBitsChunks = chunkArray(readyBits, chunkSize);

  return (
    <>
      <div className={`inline-flex flex-col items-center ${className}`}>
        <h2 className="text-lg font-semibold">Free (green) + Ready (+)</h2>
        <div className="flex space-x-1">
          {freeListChunks.map((freeChunk, chunkIdx) => (
            <div
              key={chunkIdx}
              className="mb-4 overflow-hidden rounded-lg border ROB-border-color"
            >
              <table className="border-collapse">
                <thead>
                  <tr className="bg-slate-300">
                    <th className="text-sm p-2">PR #</th>
                    {/* <th className="text-sm border-l ROB-border-color p-2">
                      Free
                    </th> */}
                    {/* <th className="text-sm border-l ROB-border-color p-2">
                      Ready
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {freeChunk.map((frizzy_data, idx) => {
                    const globalIdx = chunkIdx * chunkSize + idx;
                    const prNumber = globalIdx.toString();
                    const free = freeChunk[idx];
                    const ready = readyBitsChunks[chunkIdx][idx];

                    return (
                      <tr key={globalIdx} className="">
                        <td
                          className={`text-center text-sm border-t ROB-border-color ${
                            free === "1" ? "bg-green-200" : "bg-gray-200"
                          }`}
                        >
                          <div className="flex  px-3 space-x-1">
                            <span className="w-4">{prNumber}</span>
                            <span className={"flex items-center"}>
                              {readyBits[globalIdx] === "1" ? "+" : "\u00A0"}
                            </span>
                          </div>
                        </td>
                        {/* <td
                          className={`text-center text-sm border-l border-t ROB-border-color ${
                            free == "1" ? "bg-green-200" : "bg-red-200"
                          }`}
                        >
                          {free}
                        </td> */}
                        {/* <td
                          className={`text-center text-sm border-l border-t ROB-border-color ${
                            ready == "1" ? "bg-green-200" : "bg-red-200"
                          }`}
                        >
                          {ready}
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayFrizzyList;
