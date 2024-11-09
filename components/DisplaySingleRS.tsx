import React from "react";
import * as Types from "@/lib/types";
import { displayValue } from "@/lib/utils";
import { parseInstruction } from "@/lib/tsutils";

type DisplaySingleRSProps = {
  className: string;
  RSIdx: number;
  RSData: Types.RS_DATA;
};

const DisplaySingleRS: React.FC<DisplaySingleRSProps> = ({
  className,
  RSIdx,
  RSData,
}) => {
  return (
    <div className={`${className}  hover:shadow-2xl transition-shadow`}>
      <div className="overflow-hidden rounded-lg border ROB-border-color">
        <table
          className={`w-full border-collapse ${
            RSData.occupied ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <thead>
            <tr>
              <th className="text-xs p-1 bg-slate-300" colSpan={2}>
                RS: #{RSIdx}
              </th>
            </tr>
            <tr>
              <td
                className="text-xs p-1 border-t ROB-border-color text-center font-semibold"
                colSpan={2}
              >
                {parseInstruction(RSData.packet.inst.inst)}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                T_new:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(RSData.T_new)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                T_a:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(RSData.T_a)}
                {RSData.ready_ta ? "+" : " "}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                T_b:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(RSData.T_b)}
                {RSData.ready_tb ? "+" : " "}
              </td>
            </tr>
            <tr
              className={`${
                Number.isNaN(RSData.imm_value) && RSData.has_imm
                  ? "bg-red-500"
                  : !RSData.has_imm && RSData.occupied
                  ? "bg-gray-200"
                  : ""
              }`}
            >
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                Imm:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(RSData.imm_value)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                FU Type:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {Types.getFUTypeName(RSData.fu)}
              </td>
            </tr>

            {/* func data */}
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                func:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color w-16">
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplaySingleRS;
