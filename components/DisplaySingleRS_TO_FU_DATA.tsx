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

type DisplaySingleRS_TO_FU_DATAProps = {
  className: string;
  FUIdx: number;
  RS_TO_FUData: Types.RS_TO_FU_DATA;
  fu_type: Types.FU_TYPE;
};

const DisplaySingleRS_TO_FU_DATA: React.FC<DisplaySingleRS_TO_FU_DATAProps> = ({
  className,
  FUIdx,
  RS_TO_FUData,
  fu_type,
}) => {
  return (
    <div className={`${className} hover:shadow-2xl transition-shadow`}>
      <Dtable className={`${RS_TO_FUData.valid ? "bg-good" : "bg-bad"}`}>
        <Dthead>
          <Dtr>
            <th className="text-xs p-1" colSpan={2}>
              FU: #{FUIdx}
            </th>
          </Dtr>
        </Dthead>
        <Dtbody>
          <Dtr>
            <Dtd className="text-xs p-1 font-semibold w-40" colSpan={2}>
              {parseInstruction(RS_TO_FUData.packet.inst.inst)}
            </Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">T_new:</DtdLeft>
            <Dtd className="text-xs p-1">
              {displayValue(RS_TO_FUData.T_new)}
            </Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">T_a:</DtdLeft>
            <Dtd className="text-xs p-1">{displayValue(RS_TO_FUData.T_a)}</Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">T_b:</DtdLeft>
            <Dtd className="text-xs p-1">{displayValue(RS_TO_FUData.T_b)}</Dtd>
          </Dtr>
          <Dtr
            className={`${
              Number.isNaN(RS_TO_FUData.imm_value) && RS_TO_FUData.has_imm
                ? "bg-red-500"
                : !RS_TO_FUData.has_imm && RS_TO_FUData.valid
                ? "bg-neutral"
                : ""
            }`}
          >
            <DtdLeft className="text-xs p-1">Imm:</DtdLeft>
            <Dtd className="text-xs p-1 w-20">
              {displayValueHex(RS_TO_FUData.imm_value)}
            </Dtd>
          </Dtr>

          {/* EBR */}
          <Dtr>
            <DtdLeft className="text-xs p-1">BMASK:</DtdLeft>
            <Dtd className="text-xs p-1">{RS_TO_FUData.b_mask}</Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">PC:</DtdLeft>
            <Dtd className="text-xs p-1">
              {displayValueHex(RS_TO_FUData.PC)}
            </Dtd>
          </Dtr>

          {/* func data */}
          <Dtr>
            <DtdLeft className="text-xs p-1">FU Type:</DtdLeft>
            <Dtd className="text-xs p-1 w-16">
              {Types.getFUTypeName(fu_type)}
            </Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">func:</DtdLeft>
            <Dtd className="text-xs p-1">
              {(() => {
                switch (fu_type) {
                  case Types.FU_TYPE.ALU:
                    return Types.getALUFuncName(
                      RS_TO_FUData.fu_func as Types.ALU_FUNC
                    );
                  case Types.FU_TYPE.MUL:
                    return Types.getMULFuncName(
                      RS_TO_FUData.fu_func as Types.MULT_FUNC
                    );
                  case Types.FU_TYPE.BR:
                    return Types.getBRFuncName(
                      RS_TO_FUData.fu_func as Types.BRANCH_FUNC
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

export default DisplaySingleRS_TO_FU_DATA;
