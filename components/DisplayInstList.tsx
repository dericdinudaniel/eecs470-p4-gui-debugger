import React from "react";
import { parseInstruction } from "@/lib/tsutils";
import * as Types from "@/lib/types";
import { displayValueHex } from "@/lib/utils";
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
        <Dtable>
          <Dthead>
            <Dtr>
              <DthLeft>#</DthLeft>
              <Dth>PC</Dth>
              <Dth>
                <div className="w-36">Inst</div>
              </Dth>
              {isIB && <Dth>H/T</Dth>}
            </Dtr>
          </Dthead>
          <Dtbody>
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
              let color = "bg-neutral";
              if (isBoth) {
                color = "bg-med";
              } else if (isHead) {
                color = "bg-good";
              } else if (isTail) {
                color = "bg-bad";
              } else if (!isIB) {
                color = entry.valid ? "bg-good" : "bg-bad";
              } else if (validList != undefined && validList[idx] && isIB) {
                color = "bg-medLight";
              }

              const headOrTailString =
                "←" + (isBoth ? "H&T" : isHead ? "Head" : isTail ? "Tail" : "");

              return (
                <Dtr key={idx} className={color}>
                  <DtdLeft className="font-semibold">{entryNumber}</DtdLeft>
                  <Dtd className="w-10">{displayValueHex(entry.PC)}</Dtd>
                  <Dtd className="font-semibold">
                    {parseInstruction(entry.inst.inst)}
                  </Dtd>
                  {isIB && (
                    <Dtd>
                      <div className="w-14">{isEither && headOrTailString}</div>
                    </Dtd>
                  )}
                </Dtr>
              );
            })}
          </Dtbody>
        </Dtable>
      </div>
    </>
  );
};

export default DisplayInstList;
