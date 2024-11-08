import React from "react";
import * as Types from "@/lib/types";
import { displayValue } from "@/lib/utils";

type DisplayROBDataProps = {
  className: string;
  ROBData: Types.ROB_DATA[];
  head: number;
  tail: number;
  isROB: boolean;
};

const DisplayROBData: React.FC<DisplayROBDataProps> = ({
  className,
  ROBData,
  head,
  tail,
  isROB,
}) => {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-lg border ROB-border-color">
        <table className="border-collapse">
          <thead>
            <tr className="bg-slate-300">
              <th className="text-sm px-4">#</th>
              <th className="text-sm border-l ROB-border-color px-2 py-1">
                R_dest
              </th>
              <th className="text-sm border-l ROB-border-color px-2 py-1">
                T_new
              </th>
              <th className="text-sm border-l ROB-border-color px-2 py-1">
                T_old
              </th>
              <th className="text-sm border-l ROB-border-color px-2 py-1">
                Valid
              </th>
              {isROB && (
                <>
                  <th className="text-sm border-l ROB-border-color px-2 py-1">
                    Ret?
                  </th>
                  <th className="text-sm border-l ROB-border-color px-2 py-1">
                    H/T
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {ROBData.map((entry, idx) => {
              let isHead = head === idx;
              let isTail = tail === idx;

              if (!isROB) {
                isHead = false;
                isTail = false;
              }

              const isBoth = isHead && isTail;
              const isEither = isHead || isTail;

              const entryNumber = idx.toString().padStart(2, "") + ":";

              // green if tail, red if head, yellow if both
              const color = isBoth
                ? "bg-yellow-200"
                : isHead
                ? "bg-red-200"
                : isTail
                ? "bg-green-200"
                : entry.valid && !isROB
                ? "bg-green-200"
                : entry.valid && isROB
                ? "bg-yellow-100"
                : "bg-gray-200";

              const headOrTailString =
                "←" + (isBoth ? "H&T" : isHead ? "Head" : isTail ? "Tail" : "");

              return (
                <tr key={idx} className={color}>
                  <td className="text-right text-sm border-t ROB-border-color">
                    {entryNumber}
                  </td>
                  <td className="text-center text-sm border-l border-t ROB-border-color">
                    {"r" + displayValue(entry.R_dest)}
                  </td>
                  <td className="text-center text-sm border-l border-t ROB-border-color">
                    {"p" + displayValue(entry.T_new)}
                  </td>
                  <td className="text-center text-sm border-l border-t ROB-border-color">
                    {"p" + displayValue(entry.T_old)}
                  </td>
                  <td className="text-center text-sm border-l border-t ROB-border-color">
                    {displayValue(entry.valid ? "1" : "0")}
                  </td>
                  {isROB && (
                    <>
                      <td className="text-center text-sm border-l border-t ROB-border-color">
                        {displayValue(entry.retireable ? "1" : "0")}
                      </td>
                      <td className="text-center text-sm border-l border-t ROB-border-color">
                        <div className="w-14">
                          {isEither && headOrTailString}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayROBData;
