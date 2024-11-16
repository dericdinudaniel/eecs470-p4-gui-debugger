import React from "react";
import { parseInstruction } from "@/lib/tsutils";
import * as Types from "@/lib/types";
import { displayValueHex } from "@/lib/utils";

type DisplayInstListProps = {
  className: string;
  instList: Types.ID_EX_PACKET[];
  validList?: boolean[];
  head: number;
  tail: number;
  isIB: boolean;
};

const DisplayInstList: React.FC<DisplayInstListProps> = ({
  className,
  instList,
  validList,
  head,
  tail,
  isIB,
}) => {
  return (
    <>
      <div className={`${className}`}>
        <div className="overflow-hidden rounded-lg border ROB-border-color">
          <table className="border-collapse">
            <thead>
              <tr className="bg-slate-300">
                <th className="text-sm px-4">#</th>
                <th className="text-sm border-l ROB-border-color px-2 py-1">
                  PC test
                </th>
                <th className="text-sm border-l ROB-border-color px-2 py-1">
                  <div className="w-36">Inst</div>
                </th>
                {isIB && (
                  <th className="text-sm border-l ROB-border-color px-2 py-1">
                    H/T
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {instList.map((entry, idx) => {
                let isHead = head === idx;
                let isTail = tail === idx;

                if (!isIB) {
                  isHead = false;
                  isTail = false;
                }

                const isBoth = isHead && isTail;
                const isEither = isHead || isTail;

                const entryNumber = idx.toString().padStart(2, "") + ":";

                // green if tail, red if head, yellow if both
                let color = "bg-gray-200";
                if (isBoth) {
                  color = "bg-yellow-200";
                } else if (isHead) {
                  color = "bg-green-200";
                } else if (isTail) {
                  color = "bg-red-200";
                } else if (!isIB) {
                  color = entry.valid ? "bg-green-200" : "bg-red-200";
                } else if (validList != undefined && validList[idx] && isIB) {
                  color = "bg-yellow-100";
                }

                const headOrTailString =
                  "←" +
                  (isBoth ? "H&T" : isHead ? "Head" : isTail ? "Tail" : "");

                return (
                  <tr key={idx} className={color}>
                    <td className="text-right text-sm border-t ROB-border-color font-semibold">
                      {entryNumber}
                    </td>
                    <td className="text-center text-sm border-l border-t ROB-border-color font-semibold w-10">
                      {displayValueHex(entry.PC)}
                    </td>
                    <td className="text-center text-sm border-l border-t ROB-border-color font-semibold">
                      {parseInstruction(entry.inst.inst)}
                    </td>
                    {isIB && (
                      <td className="text-center text-sm border-l border-t ROB-border-color">
                        <div className="w-14">
                          {isEither && headOrTailString}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DisplayInstList;
