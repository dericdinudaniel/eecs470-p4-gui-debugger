import React from "react";
import * as Types from "@/lib/types";
import DisplaySingleRS from "./DisplaySingleRS";

type DisplayRSDataProps = {
  className: string;
  RSData: Types.RS_DATA[];
};

const DisplayRSData: React.FC<DisplayRSDataProps> = ({ className, RSData }) => {
  return (
    <>
      <div>rs</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {RSData.map((rs, idx) => (
          <div
            key={idx}
            className="flex items-center p-4 border rounded-2xl shadow-lg bg-gray-200"
          >
            <p className="text-sm">RS Entry {idx}:</p>
            <DisplaySingleRS className={className} RSData={rs} />
          </div>
        ))}
      </div>
    </>
  );
};

export default DisplayRSData;
