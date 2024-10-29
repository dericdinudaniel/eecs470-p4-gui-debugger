import React from "react";
import * as Types from "@/lib/types";
import { displayValue } from "@/lib/utils";

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
    <div className={`${className}`}>
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
          </thead>
          <tbody>
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                Occupied:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {RSData.occupied ? "Yes" : "No"}
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
            <tr>
              <td className="text-xs p-1 text-right border-t border-r ROB-border-color">
                T:
              </td>
              <td className="text-xs p-1 text-center border-t ROB-border-color">
                {displayValue(RSData.T_dest)}
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplaySingleRS;
