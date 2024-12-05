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
import { SimpleValDisplay } from "./dui/SimpleValDisplay";

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
      <Dtable className={`${RSData.occupied ? "bg-good" : "bg-bad"}`}>
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
              className="text-xs p-1 text-center font-semibold w-36"
              colSpan={2}
            >
              {parseInstruction(RSData.rs_to_fu_data.packet.inst.inst)}
            </DtdLeft>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">T_new:</DtdLeft>
            <Dtd className="text-xs p-1">
              {displayValue(RSData.rs_to_fu_data.T_new)}
            </Dtd>
          </Dtr>

          {/* source operands */}
          <Dtr>
            <Dtd colSpan={2} className="p-0">
              <div className="flex">
                {/* Left column (T_a) */}
                <div
                  className={`w-1/2 ${
                    RSData.occupied &&
                    !Number.isNaN(RSData.rs_to_fu_data.T_a) &&
                    RSData.rs_to_fu_data.T_a !== 0 &&
                    EarlyCDB?.includes(RSData.rs_to_fu_data.T_a)
                      ? "bg-veryGood"
                      : ""
                  }`}
                >
                  <SimpleValDisplay
                    label="Ta: "
                    className="py-[.1rem]"
                    labelClassName="text-xs font-normal"
                    dataClassName="text-xs"
                  >
                    {displayValue(RSData.rs_to_fu_data.T_a)}
                    {RSData.ready_ta ? "+" : " "}
                  </SimpleValDisplay>
                </div>

                {/* Right column (T_b) */}
                <div
                  className={`w-1/2 border-l ${
                    RSData.occupied &&
                    !Number.isNaN(RSData.rs_to_fu_data.T_b) &&
                    RSData.rs_to_fu_data.T_b !== 0 &&
                    EarlyCDB?.includes(RSData.rs_to_fu_data.T_b)
                      ? "bg-veryGood"
                      : ""
                  }`}
                >
                  <SimpleValDisplay
                    label="Tb: "
                    className="py-[.1rem]"
                    labelClassName="text-xs font-normal"
                    dataClassName="text-xs"
                  >
                    {displayValue(RSData.rs_to_fu_data.T_b)}
                    {RSData.ready_tb ? "+" : " "}
                  </SimpleValDisplay>
                </div>
              </div>
            </Dtd>
          </Dtr>

          <Dtr
            className={`${
              Number.isNaN(RSData.rs_to_fu_data.imm_value) &&
              RSData.rs_to_fu_data.has_imm
                ? "bg-veryBad"
                : !RSData.rs_to_fu_data.has_imm && RSData.occupied
                ? "bg-neutral"
                : ""
            }`}
          >
            <DtdLeft className="text-xs p-1">Imm:</DtdLeft>
            <Dtd className="text-xs p-1">
              {displayValueHex(RSData.rs_to_fu_data.imm_value)}
            </Dtd>
          </Dtr>

          {/* EBR */}
          <Dtr>
            <DtdLeft className="text-xs p-1">BMASK:</DtdLeft>
            <Dtd className="text-xs p-1">{RSData.rs_to_fu_data.b_mask}</Dtd>
          </Dtr>
          <Dtr>
            <DtdLeft className="text-xs p-1">PC:</DtdLeft>
            <Dtd className="text-xs p-1">
              {displayValueHex(RSData.rs_to_fu_data.PC)}
            </Dtd>
          </Dtr>

          {/* lsq */}
          <Dtr>
            <DtdLeft className="text-xs p-1">SQ IDX</DtdLeft>
            <Dtd className="text-xs p-1">{RSData.rs_to_fu_data.saved_tail}</Dtd>
          </Dtr>

          {/* func data */}
          <Dtr>
            <Dtd colSpan={2} className="text-xs p-1">
              {Types.getFUTypeName(RSData.fu)}
              {" | "}
              {(() => {
                switch (RSData.fu) {
                  case Types.FU_TYPE.ALU:
                    return Types.getALUFuncName(
                      RSData.rs_to_fu_data.fu_func as Types.ALU_FUNC
                    );
                  case Types.FU_TYPE.MUL:
                    return Types.getMULFuncName(
                      RSData.rs_to_fu_data.fu_func as Types.MULT_FUNC
                    );
                  case Types.FU_TYPE.BR:
                    return Types.getBRFuncName(
                      RSData.rs_to_fu_data.fu_func as Types.BRANCH_FUNC
                    );
                  case Types.FU_TYPE.LOAD:
                    return Types.getLOADFuncName(
                      RSData.rs_to_fu_data.fu_func as Types.LOAD_FUNC
                    );
                  case Types.FU_TYPE.STORE:
                    return Types.getSTOREFuncName(
                      RSData.rs_to_fu_data.fu_func as Types.STORE_FUNC
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
