import React from "react";
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
import { useDisplayContext } from "./DisplayContext";

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

  const { tag } = useDisplayContext();

  const chunkSize = 16;
  const freeListChunks = chunkArray(freeList, chunkSize);
  const readyBitsChunks = chunkArray(readyBits, chunkSize);

  return (
    <div className={`flex-col justify-items-center ${className}`}>
      <h2 className="text-lg font-semibold">Free + Ready List</h2>
      <Dtable>
        <Dthead>
          <Dtr>
            <Dth className="text-sm p-1" colSpan={freeListChunks.length}>
              PR #
            </Dth>
          </Dtr>
        </Dthead>
        <Dtbody>
          {Array.from({ length: chunkSize }).map((_, rowIdx) => (
            <Dtr key={rowIdx}>
              {freeListChunks.map((freeChunk, colIdx) => {
                const globalIdx = colIdx * chunkSize + rowIdx;
                if (globalIdx >= freeList.length) {
                  return (
                    <Dtd key={globalIdx} className="bg-gray-400">
                      &nbsp;
                    </Dtd>
                  );
                }
                const prNumber = globalIdx;
                const free = freeChunk[rowIdx];
                const ready = readyBitsChunks[colIdx][rowIdx];

                let color = "bg-neutral";
                if (free === "1" && ready === "1") {
                  color = "bg-veryBad";
                } else if (free === "1") {
                  color = "bg-good";
                }

                return (
                  <Dtd
                    key={globalIdx}
                    className={`text-center text-sm  ${color}`}
                  >
                    <div className="flex px-3 space-x-1">
                      <span
                        className={`w-4 ${
                          tag == prNumber ? "bg-tagSearchHit" : ""
                        }`}
                      >
                        {prNumber}
                      </span>
                      <span
                        className={`flex items-center ${
                          tag == prNumber ? "bg-tagSearchHit" : ""
                        }`}
                      >
                        {ready === "1" ? "+" : "\u00A0"}
                      </span>
                    </div>
                  </Dtd>
                );
              })}
            </Dtr>
          ))}
        </Dtbody>
      </Dtable>
    </div>
  );
};

export default DisplayFrizzyList;
