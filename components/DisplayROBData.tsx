import React from "react";
import * as Types from "@/lib/types";

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
      <table className="">
        <thead className="border ROB-border-color bg-slate-300">
          <tr>
            <th className=" p-2">Entry #</th>
            <th className=" border-l ROB-border-color p-2">R_dest</th>
            <th className=" border-l ROB-border-color p-2">T_new</th>
            <th className=" border-l ROB-border-color p-2">T_old</th>
            <th className=" border-l ROB-border-color p-2">Valid</th>
            {isROB && (
              <>
                <th className=" border-l ROB-border-color p-2">Retirable</th>
                <th className=" border-l ROB-border-color p-2 pl-9">
                  Head/Tail
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

            // Helper function to display the value or "NaN"
            const displayValue = (value: any) => (isNaN(value) ? "XX" : value);

            // green if tail, red if head, yellow if both
            const color = isBoth
              ? "bg-yellow-200"
              : isHead
              ? "bg-red-200"
              : isTail
              ? "bg-green-200"
              : entry.valid
              ? "bg-yellow-100"
              : "bg-gray-200";
            const headOrTailString =
              "←" +
              (isBoth
                ? " Head/Tail"
                : isHead
                ? " Head"
                : isTail
                ? " Tail"
                : "");

            return (
              <tr key={idx} className={`border ROB-border-color ${color}`}>
                <td className="text-right border-l ROB-border-color">
                  {entryNumber}
                </td>
                <td className="text-center border-l ROB-border-color">
                  {"r" + displayValue(entry.R_dest)}
                </td>
                <td className="text-center border-l ROB-border-color">
                  {"p" + displayValue(entry.T_new)}
                </td>
                <td className="text-center border-l ROB-border-color">
                  {"p" + displayValue(entry.T_old)}
                </td>
                <td className="text-center border-l ROB-border-color">
                  {displayValue(entry.valid ? "1" : "0")}
                </td>
                {isROB && (
                  <>
                    <td className="text-center border-l ROB-border-color">
                      {displayValue(entry.retireable ? "1" : "0")}
                    </td>
                    <td className="text-center border-l border-r ROB-border-color pl-1">
                      {isEither && headOrTailString}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayROBData;
