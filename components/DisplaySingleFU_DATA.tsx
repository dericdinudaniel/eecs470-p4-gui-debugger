import React from "react";
import * as Types from "@/lib/types";
import { displayValue, displayValueHex } from "@/lib/utils";
import { parseInstruction } from "@/lib/tsutils";

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
  return (
    <div className={`${className}`}>
      <div className="overflow-hidden rounded-lg hover:shadow-2xl transition-shadow border ROB-border-color">
        <table
          className={`w-full border-collapse ${
            FUData.valid ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <thead>
            <tr>
              <th className="text-xs p-1 bg-slate-300" colSpan={2}>
                FU: #{FUIdx}
              </th>
            </tr>
            {/* <tr>
              <td
                className="text-xs p-1 border-t ROB-border-color text-center font-semibold"
                colSpan={2}
              >
                {parseInstruction(FUData.packet.inst.inst)}
              </td>
            </tr> */}
          </thead>
          <tbody>
            {/* <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                Valid:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color w-16">
                {FUData.valid ? "Yes" : "No"}
              </td>
            </tr> */}
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                T_new:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(FUData.T_new)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                rs1:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValueHex(FUData.rs1)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                rs2:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValueHex(FUData.rs2)}
              </td>
            </tr>

            {/* EBR */}
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                BMASK:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {FUData.b_mask}
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

export default DisplaySingleFU_DATA;
