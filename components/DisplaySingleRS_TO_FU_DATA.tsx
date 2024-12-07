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
import { useTagSearchContext } from "./TagSearch";

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
  const { tag } = useTagSearchContext();

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
            <Dtd className="text-xs p-1 font-semibold w-36" colSpan={2}>
              {parseInstruction(RS_TO_FUData.packet.inst.inst)}
            </Dtd>
          </Dtr>
          <Dtr
            className={
              RS_TO_FUData.valid && tag == RS_TO_FUData.T_new
                ? "bg-tagSearchHit"
                : ""
            }
          >
            <DtdLeft className="text-xs p-1">T_new:</DtdLeft>
            <Dtd className="text-xs p-1">
              p{displayValue(RS_TO_FUData.T_new)}
            </Dtd>
          </Dtr>

          <Dtr>
            <Dtd colSpan={2} className="p-0">
              <div className="flex">
                {/* Left column (T_a) */}
                <div className="w-1/2">
                  <SimpleValDisplay
                    label="Ta: "
                    className="py-[.1rem]"
                    labelClassName="text-xs font-normal"
                    dataClassName="text-xs"
                  >
                    p{displayValue(RS_TO_FUData.T_a)}
                  </SimpleValDisplay>
                </div>

                {/* Right column (T_b) */}
                <div className="w-1/2 border-l">
                  <SimpleValDisplay
                    label="Tb: "
                    className="py-[.1rem]"
                    labelClassName="text-xs font-normal"
                    dataClassName="text-xs"
                  >
                    p{displayValue(RS_TO_FUData.T_b)}
                  </SimpleValDisplay>
                </div>
              </div>
            </Dtd>
          </Dtr>

          <Dtr
            className={`${
              Number.isNaN(RS_TO_FUData.imm_value) && RS_TO_FUData.has_imm
                ? "bg-veryBad"
                : !RS_TO_FUData.has_imm && RS_TO_FUData.valid
                ? "bg-neutral"
                : ""
            }`}
          >
            <DtdLeft className="text-xs p-1">Imm:</DtdLeft>
            <Dtd className="text-xs p-1">
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

          {/* lsq */}
          <Dtr>
            <DtdLeft className="text-xs p-1">SQ IDX</DtdLeft>
            <Dtd className="text-xs p-1">{RS_TO_FUData.saved_tail}</Dtd>
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
                  case Types.FU_TYPE.LOAD:
                    return Types.getLOADFuncName(
                      RS_TO_FUData.fu_func as Types.LOAD_FUNC
                    );
                  case Types.FU_TYPE.STORE:
                    return Types.getSTOREFuncName(
                      RS_TO_FUData.fu_func as Types.STORE_FUNC
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
