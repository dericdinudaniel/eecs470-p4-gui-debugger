import React from "react";
import * as Types from "@/lib/types";
import { Separator } from "./ui/separator";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";

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
      <div className={`${className}`}>
        <div
          className={`border rounded-lg p-1 flex flex-col ${
            isValid ? "bg-good" : "bg-bad"
          }`}
        >
          <p className="text-md font-semibold underline">Correct Branch Data</p>

          <div className="flex flex-col items-center">
            <SimpleValDisplay label="BMASK: " className="text-sm">
              {data.bmask}
            </SimpleValDisplay>

            <SimpleValDisplay label="Taken: " className="text-sm">
              {data.taken ? "True" : "False"}
            </SimpleValDisplay>

            <SimpleValDisplay label="Is Jalr: " className="text-sm">
              {data.is_jalr ? "True" : "False"}
            </SimpleValDisplay>

            <SimpleValDisplay label="Target: " className="text-sm">
              {data.target}
            </SimpleValDisplay>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayFU_TO_BS_DATA;
