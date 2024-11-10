import React from "react";
import * as Types from "@/lib/types";
import { displayValue } from "@/lib/utils";
import { parseInstruction } from "@/lib/tsutils";

type DisplaySingleRS_TO_FU_DATAProps = {
  className: string;
  FUIdx: number;
  RS_TO_FUData: Types.RS_TO_FU_DATA;
  fu_type: Types.FU_TYPE;
};

const getFU_TYPE = (fu_data: Types.FU_DATA) => {
  switch (fu_data.fu_type) {
    case Types.FU_TYPE.ALU:
      return fu_data.data as Types.ALU_DATA;
    case Types.FU_TYPE.MUL:
      return fu_data.data as Types.MULT_DATA;
    case Types.FU_TYPE.BR:
      return fu_data.data as Types.BRANCH_DATA;
  }
};

const DisplaySingleRS_TO_FU_DATA: React.FC<DisplaySingleRS_TO_FU_DATAProps> = ({
  className,
  FUIdx,
  RS_TO_FUData,
  fu_type,
}) => {
  return (
    <div className={`${className}  hover:shadow-2xl transition-shadow`}>
      <div className="overflow-hidden rounded-lg border ROB-border-color">
        <table
          className={`w-full border-collapse ${
            RS_TO_FUData.valid ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <thead>
            <tr>
              <th className="text-xs p-1 bg-slate-300" colSpan={2}>
                FU: #{FUIdx}
              </th>
            </tr>
            <tr>
              <td
                className="text-xs p-1 border-t ROB-border-color text-center font-semibold"
                colSpan={2}
              >
                {parseInstruction(RS_TO_FUData.packet.inst.inst)}
              </td>
            </tr>
          </thead>
          <tbody>
            {/* <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                Valid:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color w-16">
                {RS_TO_FUData.valid ? "Yes" : "No"}
              </td>
            </tr> */}
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                T_new:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(RS_TO_FUData.T_new)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                rs1:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(RS_TO_FUData.T_a)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                rs2:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
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
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                Imm:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(RS_TO_FUData.imm_value)}
              </td>
            </tr>

            {/* EBR */}
            {/* EBR */}
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                BMASK:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {RS_TO_FUData.b_mask}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                Predicted:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {RS_TO_FUData.predicted ? "T" : "NT"}
              </td>
            </tr>

            {/* func data */}
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                FU Type:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color w-16">
                {Types.getFUTypeName(fu_type)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                func:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
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
