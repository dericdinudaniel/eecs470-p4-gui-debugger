import React from "react";
import * as Types from "@/lib/types";
import { displayValue, displayValueHex } from "@/lib/utils";
import { parseInstruction } from "@/lib/tsutils";

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
    <div className={`${className}`}>
      <div className="overflow-hidden rounded-lg hover:shadow-2xl transition-shadow border table-border-color">
        <table
          className={`w-full border-collapse ${
            RS_TO_FUData.valid ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <thead className="bg-slate-300">
            <tr>
              <th className="text-xs p-1" colSpan={2}>
                FU: #{FUIdx}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className="text-xs p-1 border-t table-border-color text-center font-semibold w-40"
                colSpan={2}
              >
                {parseInstruction(RS_TO_FUData.packet.inst.inst)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r table-border-color">
                T_new:
              </td>
              <td className="text-xs p-1 text-center border-t table-border-color">
                {displayValue(RS_TO_FUData.T_new)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r table-border-color">
                T_a:
              </td>
              <td className="text-xs p-1 text-center border-t table-border-color">
                {displayValue(RS_TO_FUData.T_a)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r table-border-color">
                T_b:
              </td>
              <td className="text-xs p-1 text-center border-t table-border-color">
                {displayValue(RS_TO_FUData.T_b)}
              </td>
            </tr>
            <tr
              className={`${
                Number.isNaN(RS_TO_FUData.imm_value) && RS_TO_FUData.has_imm
                  ? "bg-red-500"
                  : !RS_TO_FUData.has_imm && RS_TO_FUData.valid
                  ? "bg-gray-200"
                  : ""
              }`}
            >
              <td className="text-xs p-1 text-right border-t border-r table-border-color">
                Imm:
              </td>
              <td className="text-xs p-1 text-center border-t table-border-color w-20">
                {displayValueHex(RS_TO_FUData.imm_value)}
              </td>
            </tr>

            {/* EBR */}
            <tr>
              <td className="text-xs p-1 text-right border-t border-r table-border-color">
                BMASK:
              </td>
              <td className="text-xs p-1 text-center border-t table-border-color">
                {RS_TO_FUData.b_mask}
              </td>
            </tr>

            {/* func data */}
            <tr>
              <td className="text-xs p-1 text-right border-t border-r table-border-color">
                FU Type:
              </td>
              <td className="text-xs p-1 text-center border-t table-border-color w-16">
                {Types.getFUTypeName(fu_type)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r table-border-color">
                func:
              </td>
              <td className="text-xs p-1 text-center border-t table-border-color">
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplaySingleRS_TO_FU_DATA;
