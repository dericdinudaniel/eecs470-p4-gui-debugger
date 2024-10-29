import React from "react";
import * as Types from "@/lib/types";

type DisplaySingleRSProps = {
  className: string;
  RSData: Types.RS_DATA;
};

const DisplaySingleRS: React.FC<DisplaySingleRSProps> = ({
  className,
  RSData,
}) => {
  return (
    <>
      <div className=" rounded border ROB-border-color p-1 m-1">
        <p className="text-xs">Occupied: {RSData.occupied ? "Yes" : "No"}</p>
        <p className="text-xs">Func. Unit: {Types.getFUTypeName(RSData.fu)}</p>
        <p className="text-xs">Dest. Tag: {RSData.T_dest}</p>
        <p className="text-xs">
          Src. Tag A: {RSData.T_a} {RSData.ready_ta ? "+" : " "}
        </p>
        <p className="text-xs">
          Src. Tag B: {RSData.T_b} {RSData.ready_tb ? "+" : " "}
        </p>
      </div>
    </>
  );
};

export default DisplaySingleRS;
