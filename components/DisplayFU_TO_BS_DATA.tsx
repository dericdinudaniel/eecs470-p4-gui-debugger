import React from "react";
import * as Types from "@/lib/types";
import { Separator } from "./ui/separator";

type DisplayFU_TO_BS_DATAProps = {
  className: string;
  data: Types.FU_TO_BS_DATA;
};

const DisplayFU_TO_BS_DATA: React.FC<DisplayFU_TO_BS_DATAProps> = ({
  className,
  data,
}) => {
  // if BMASK is all 0s, then it is invalid
  const isValid = data.bmask.split("").some((bit) => bit === "1");

  return (
    <>
      <div className={`${className} ${isValid ? "bg-good" : "bg-bad"}`}>
        <div className="border rounded-lg p-1 flex flex-col">
          <p className="text-md font-semibold">Correct Branch Data</p>
          <Separator />
          <div className="flex flex-col items-center mt-2">
            <div className="text-sm">
              <span className="font-bold">BMASK: </span>
              {data.bmask}
            </div>
            <div className="text-sm">
              <span className="font-bold">Taken: </span>
              {data.taken ? "True" : "False"}
            </div>
            <div className="text-sm">
              <span className="font-bold">Is Jalr: </span>
              {data.is_jalr ? "True" : "False"}
            </div>
            <div className="text-sm">
              <span className="font-bold">Target: </span>
              {data.target}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayFU_TO_BS_DATA;
