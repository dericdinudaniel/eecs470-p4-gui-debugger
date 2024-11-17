import React from "react";
import * as Types from "@/lib/types";
import { displayValue, displayValueHex } from "@/lib/utils";
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

type DisplaySingleRSProps = {
  className: string;
  RSIdx: number;
  RSData: Types.RS_DATA;
  EarlyCDB?: Types.PHYS_REG_TAG[];
};

const DisplaySingleRS: React.FC<DisplaySingleRSProps> = ({
  className,
  RSIdx,
  RSData,
  EarlyCDB,
}) => {
  return (
    <div className={`${className} hover:shadow-2xl transition-shadow`}>
      <Dtable className={`${RSData.occupied ? "bg-green-200" : "bg-red-200"}`}>
        <Dthead>
          <Dtr>
            <DthLeft className="text-xs p-1" colSpan={2}>
              RS: #{RSIdx}
            </DthLeft>
          </Dtr>
        </Dthead>
        <Dtbody>
          <Dtr>
            <DtdLeft
              className="text-xs p-1 text-center font-semibold w-40"
              colSpan={2}
            >
              {parseInstruction(RSData.packet.inst.inst)}
            </DtdLeft>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">T_new:</DtdLeft>
            <Dtd className="text-xs p-1">{displayValue(RSData.T_new)}</Dtd>
          </Dtr>
          <Dtr
            className={`${
              RSData.occupied &&
              !Number.isNaN(RSData.T_a) &&
              RSData.T_a != 0 &&
              EarlyCDB?.includes(RSData.T_a)
                ? "bg-green-500"
                : ""
            }`}
          >
            <DtdLeft className="text-xs p-1">T_a:</DtdLeft>
            <Dtd className="text-xs p-1">
              {displayValue(RSData.T_a)}
              {RSData.ready_ta ? "+" : " "}
            </Dtd>
          </Dtr>
          <Dtr
            className={`${
              RSData.occupied &&
              !Number.isNaN(RSData.T_b) &&
              RSData.T_b != 0 &&
              EarlyCDB?.includes(RSData.T_b)
                ? "bg-green-500"
                : ""
            }`}
          >
            <DtdLeft className="text-xs p-1">T_b:</DtdLeft>
            <Dtd className="text-xs p-1">
              {displayValue(RSData.T_b)}
              {RSData.ready_tb ? "+" : " "}
            </Dtd>
          </Dtr>
          <Dtr
            className={`${
              Number.isNaN(RSData.imm_value) && RSData.has_imm
                ? "bg-red-500"
                : !RSData.has_imm && RSData.occupied
                ? "bg-gray-200"
                : ""
            }`}
          >
            <DtdLeft className="text-xs p-1">Imm:</DtdLeft>
            <Dtd className="text-xs p-1">
              {displayValueHex(RSData.imm_value)}
            </Dtd>
          </Dtr>

          {/* EBR */}
          <Dtr>
            <DtdLeft className="text-xs p-1">BMASK:</DtdLeft>
            <Dtd className="text-xs p-1">{RSData.b_mask}</Dtd>
          </Dtr>

          {/* func data */}
          <Dtr>
            <DtdLeft className="text-xs p-1">FU Type:</DtdLeft>
            <Dtd className="text-xs p-1">{Types.getFUTypeName(RSData.fu)}</Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">func:</DtdLeft>
            <Dtd className="text-xs p-1 w-16">
              {(() => {
                switch (RSData.fu) {
                  case Types.FU_TYPE.ALU:
                    return Types.getALUFuncName(
                      RSData.fu_func as Types.ALU_FUNC
                    );
                  case Types.FU_TYPE.MUL:
                    return Types.getMULFuncName(
                      RSData.fu_func as Types.MULT_FUNC
                    );
                  case Types.FU_TYPE.BR:
                    return Types.getBRFuncName(
                      RSData.fu_func as Types.BRANCH_FUNC
                    );
                  default:
                    return "XXX";
                }
              })()}
            </Dtd>
          </Dtr>
        </Dtbody>
      </Dtable>
    </div>
  );
};

export default DisplaySingleRS;
