import React from "react";
import * as Types from "@/lib/types";
import DisplaySingleRS from "./DisplaySingleRS";
import { Card } from "./dui/Card";

type DisplayRSDataProps = {
  className: string;
  RSData: Types.RS_DATA[];
  EarlyCDB: Types.PHYS_REG_TAG[];
};

const DisplayRSData: React.FC<DisplayRSDataProps> = ({
  className,
  RSData,
  EarlyCDB,
}) => {
  return (
    <>
      <Card className="mt-2 p-3">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-1">
          {RSData.map((rs, idx) => (
            <div key={idx} className="items-center rounded-xl shadow-lg">
              <DisplaySingleRS
                className=""
                RSIdx={idx}
                RSData={rs}
                EarlyCDB={EarlyCDB}
              />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default DisplayRSData;
