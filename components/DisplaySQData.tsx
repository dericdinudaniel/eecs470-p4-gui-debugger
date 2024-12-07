import React from "react";
import * as Types from "@/lib/types";
import { displayValue, displayValueHex } from "@/lib/utils";
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
import { Card } from "./dui/Card";

type DisplaySQDataProps = {
  className: string;
  SData: Types.SQ_DATA[];
  head: number;
  tail: number;
  isSQ: boolean;
};

const DisplaySQData: React.FC<DisplaySQDataProps> = ({
  className,
  SData,
  head,
  tail,
  isSQ,
}) => {
  return (
    <Card className={className}>
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
            <Dth>T_new</Dth>
            <Dth>Type</Dth>
            <Dth>Addr</Dth>
            <Dth>Data</Dth>
            <Dth>Ret?</Dth>
            {isSQ && <Dth>H/T</Dth>}
          </Dtr>
        </Dthead>
        <Dtbody>
          {SData.map((entry, idx) => {
            let isHead = head === idx;
            let isTail = tail === idx;

            if (!isSQ) {
              isHead = false;
              isTail = false;
            }

            const isBoth = isHead && isTail;
            const isEither = isHead || isTail;

            const entryNumber = idx.toString().padStart(2, "") + ":";

            // green if tail, red if head, yellow if both
            let bgColor = "bg-neutral";
            if (isBoth) {
              bgColor = "bg-med";
            } else if (isHead) {
              bgColor = "bg-good";
            } else if (isTail) {
              bgColor = "bg-bad";
            } else if (!isSQ) {
              bgColor = entry.valid ? "bg-good" : "bg-bad";
            } else if (entry.valid && isSQ) {
              bgColor = "bg-medLight";
            }

            let fwdColor = bgColor;
            if (bgColor != "bg-neutral") {
              fwdColor = entry.address_valid ? "bg-good" : "bg-bad";
            }

            const headOrTailString =
              "←" + (isBoth ? "H&T" : isHead ? "Head" : isTail ? "Tail" : "");

            return (
              <Dtr key={idx} className={`${bgColor}`}>
                <DtdLeft className="font-semibold">{entryNumber}</DtdLeft>
                <Dtd>{entry.T_new}</Dtd>
                <Dtd>{Types.getSTOREFuncName(entry.store_type)}</Dtd>
                <Dtd className={fwdColor}>
                  <div className="w-20">
                    {displayValueHex(entry.store_address)}
                  </div>
                </Dtd>
                <Dtd className={fwdColor}>
                  {displayValueHex(entry.store_data)}
                </Dtd>
                <Dtd>{displayValue(entry.ready_mem ? "1" : "0")}</Dtd>
                {isSQ && (
                  <>
                    {/* <Dtd>{entry.store ? "Y" : "N"}</Dtd> */}
                    <Dtd className="text-sm">
                      <div className="w-14">{isEither && headOrTailString}</div>
                    </Dtd>
                  </>
                )}
              </Dtr>
            );
          })}
        </Dtbody>
      </Dtable>
    </Card>
  );
};

export default DisplaySQData;
