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
import { useDisplayContext } from "./DisplayContext";

type DisplaySingleFU_DATAProps = {
  className: string;
  FUIdx: number;
  FUData: Types.FU_DATA;
  fu_type: Types.FU_TYPE;
};

const DisplaySingleFU_DATA: React.FC<DisplaySingleFU_DATAProps> = ({
  className,
  FUIdx,
  FUData,
  fu_type,
}) => {
  const { tag } = useDisplayContext();

  return (
    <div className={`${className} hover:shadow-2xl transition-shadow`}>
      <Dtable className={`${FUData.valid ? "bg-good" : "bg-bad"}`}>
        <Dthead>
          <Dtr>
            <Dth className="text-xs p-1" colSpan={2}>
              FU: #{FUIdx}
            </Dth>
          </Dtr>
        </Dthead>
        <Dtbody>
          <Dtr
            className={
              FUData.valid && tag == FUData.T_new ? "bg-tagSearchHit" : ""
            }
          >
            <DtdLeft className="text-xs p-1">T_new:</DtdLeft>
            <Dtd className="text-xs p-1">p{displayValue(FUData.T_new)}</Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">rs1:</DtdLeft>
            <Dtd className="text-xs p-1 w-20">
              {displayValueHex(FUData.rs1)}
            </Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">rs2:</DtdLeft>
            <Dtd className="text-xs p-1 w-20">
              {displayValueHex(FUData.rs2)}
            </Dtd>
          </Dtr>

          <Dtr>
            <DtdLeft className="text-xs p-1">PC:</DtdLeft>
            <Dtd className="text-xs p-1 w-20">{displayValueHex(FUData.PC)}</Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">Imm:</DtdLeft>
            <Dtd className="text-xs p-1">{displayValueHex(FUData.imm)}</Dtd>
          </Dtr>

          {/* EBR */}
          <Dtr>
            <DtdLeft className="text-xs p-1">BMASK:</DtdLeft>
            <Dtd className="text-xs p-1">{FUData.b_mask}</Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">PC:</DtdLeft>
            <Dtd className="text-xs p-1">{displayValueHex(FUData.PC)}</Dtd>
          </Dtr>

          {/* lsq */}
          <Dtr>
            <DtdLeft className="text-xs p-1">SQ IDX</DtdLeft>
            <Dtd className="text-xs p-1">{FUData.saved_tail}</Dtd>
          </Dtr>

          {/* func data */}
          <Dtr>
            <Dtd colSpan={2} className="text-xs p-1">
              {Types.getFUTypeName(fu_type)}
              {" | "}
              {(() => {
                switch (fu_type) {
                  case Types.FU_TYPE.ALU:
                    return Types.getALUFuncName(
                      FUData.fu_func as Types.ALU_FUNC
                    );
                  case Types.FU_TYPE.MUL:
                    return Types.getMULFuncName(
                      FUData.fu_func as Types.MULT_FUNC
                    );
                  case Types.FU_TYPE.BR:
                    return Types.getBRFuncName(
                      FUData.fu_func as Types.BRANCH_FUNC
                    );
                  case Types.FU_TYPE.LOAD:
                    return Types.getLOADFuncName(
                      FUData.fu_func as Types.LOAD_FUNC
                    );
                  case Types.FU_TYPE.STORE:
                    return Types.getSTOREFuncName(
                      FUData.fu_func as Types.STORE_FUNC
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

export default DisplaySingleFU_DATA;
