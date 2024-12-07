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
import { Card, CardContent, CardHeader } from "./dui/Card";

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
    <Card className={className}>
      {isROB && <CardHeader label="ROB" className="text-sm no-underline" />}
      <CardContent className="mt-1">
        {Number.isNaN(head) && (
          <h2 className="p-1 m-2 rounded-lg bg-veryBad">HEAD IS X</h2>
        )}
        {Number.isNaN(tail) && (
          <h2 className="p-1 m-2 rounded-lg bg-veryBad">TAIL IS X</h2>
        )}
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
              {/* {isROB && <Dth>Store?</Dth>} */}
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
              let color = "bg-neutral";
              if (isBoth) {
                color = "bg-med";
              } else if (isHead) {
                color = "bg-good";
              } else if (isTail) {
                color = "bg-bad";
              } else if (!isROB) {
                color = entry.valid ? "bg-good" : "bg-bad";
              } else if (entry.valid && isROB) {
                color = "bg-medLight";
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
                      {/* <Dtd>{entry.store ? "Y" : "N"}</Dtd> */}
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
      </CardContent>
    </Card>
  );
};

export default DisplayROBData;
