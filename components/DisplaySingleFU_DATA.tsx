import React from "react";
import * as Types from "@/lib/types";
import { displayValue } from "@/lib/utils";
import { parseInstruction } from "@/lib/tsutils";

type DisplaySingleFU_DATAProps = {
  className: string;
  FUIdx: number;
  FUData: Types.FU_DATA;
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

const DisplaySingleFU_DATA: React.FC<DisplaySingleFU_DATAProps> = ({
  className,
  FUIdx,
  FUData,
}) => {
  return (
    <div className={`${className}  hover:shadow-2xl transition-shadow`}>
      <div className="overflow-hidden rounded-lg border ROB-border-color">
        <table
          className={`w-full border-collapse ${
            FUData.data.valid ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <thead>
            <tr>
              <th className="text-xs p-1 bg-slate-300" colSpan={2}>
                FU: #{FUIdx}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                Valid:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color w-16">
                {FUData.data.valid ? "Yes" : "No"}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                T_new:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(FUData.data.T_new)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                rs1:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(FUData.data.rs1)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                rs2:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(FUData.data.rs2)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                FU Type:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {Types.getFUTypeName(FUData.fu_type)}
              </td>
            </tr>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                func:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {(() => {
                  switch (FUData.fu_type) {
                    case Types.FU_TYPE.ALU:
                      return Types.getALUFuncName(
                        FUData.data.func as Types.ALU_FUNC
                      );
                    case Types.FU_TYPE.MUL:
                      return Types.getMULFuncName(
                        FUData.data.func as Types.MULT_FUNC
                      );
                    case Types.FU_TYPE.BR:
                      return Types.getBRFuncName(
                        FUData.data.func as Types.BRANCH_FUNC
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
