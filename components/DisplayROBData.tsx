import React from "react";
import * as Types from "@/lib/types";
import { displayValue } from "@/lib/utils";
import { parseInstruction } from "@/lib/tsutils";
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
      <div className="">
        <Dtable>
          <Dthead>
            <Dtr>
              <DthLeft>#</DthLeft>
              <Dth>
                <div className="w-36">Inst</div>
              </Dth>
              <Dth>R_dest</Dth>
              <Dth>T_new</Dth>
              <Dth>T_old</Dth>
              <Dth>Valid</Dth>
              <Dth>Ret?</Dth>
              {isROB && <Dth>H/T</Dth>}
            </Dtr>
          </Dthead>
          <Dtbody>
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
              let color = "bg-gray-200";
              if (isBoth) {
                color = "bg-yellow-200";
              } else if (isHead) {
                color = "bg-green-200";
              } else if (isTail) {
                color = "bg-red-200";
              } else if (!isROB) {
                color = entry.valid ? "bg-green-200" : "bg-red-200";
              } else if (entry.valid && isROB) {
                color = "bg-yellow-100";
              }

              const headOrTailString =
                "←" + (isBoth ? "H&T" : isHead ? "Head" : isTail ? "Tail" : "");

              return (
                <Dtr key={idx} className={`${color}`}>
                  <DtdLeft className="font-semibold">{entryNumber}</DtdLeft>
                  <Dtd className="font-semibold">
                    {parseInstruction(entry.packet.inst.inst)}
                  </Dtd>
                  <Dtd>{"r" + displayValue(entry.R_dest)}</Dtd>
                  <Dtd>{"p" + displayValue(entry.T_new)}</Dtd>
                  <Dtd>{"p" + displayValue(entry.T_old)}</Dtd>
                  <Dtd>{displayValue(entry.valid ? "1" : "0")}</Dtd>
                  <Dtd>{displayValue(entry.retireable ? "1" : "0")}</Dtd>
                  {isROB && (
                    <>
                      <Dtd className="text-sm">
                        <div className="w-14">
                          {isEither && headOrTailString}
                        </div>
                      </Dtd>
                    </>
                  )}
                </Dtr>
              );
            })}
          </Dtbody>
        </Dtable>
      </div>
    </div>
  );
};

export default DisplayROBData;
