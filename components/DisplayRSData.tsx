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
      <div className="pt-2"></div>
      <div className="bg-gray-300 rounded-xl p-3 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {RSData.map((rs, idx) => (
            <div key={idx} className="items-center rounded-xl shadow-lg">
              <DisplaySingleRS className="" RSIdx={idx} RSData={rs} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayRSData;
