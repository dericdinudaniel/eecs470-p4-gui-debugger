import React from "react";
import * as Constants from "@/lib/constants";
import { chunkArray } from "@/lib/tsutils";
import { displayValue } from "@/lib/utils";
import {
  Dthead,
  Dtd,
  DtdLeft,
  Dth,
  DthLeft,
  Dtr,
  Dtbody,
  Dtable,
} from "@/components/dui/DTable";
import { useTagSearchContext } from "./TagSearch";

type DisplayMapTableProps = {
  className: string;
  mapTable: number[];
};

const DisplayMapTable: React.FC<DisplayMapTableProps> = ({
  className,
  mapTable,
}) => {
  const chunkSize = 16; // Adjust the chunk size as needed
  const mapTableChunks = chunkArray(mapTable, chunkSize);

  const { tag } = useTagSearchContext();

  return (
    <div className={`justify-items-center ${className}`}>
      <h2 className="text-lg font-semibold">Map Table</h2>
      <div className="flex space-x-1">
        {mapTableChunks.map((chunk, chunkIdx) => (
          <Dtable key={chunkIdx}>
            <Dthead>
              <Dtr>
                <Dth className="p-1">AR#</Dth>
                <Dth className="p-1">PR#</Dth>
              </Dtr>
            </Dthead>
            <Dtbody>
              {chunk.map((pr, idx) => (
                <Dtr key={chunkIdx * chunkSize + idx}>
                  <DtdLeft className="font-semibold bg-neutral">
                    {chunkIdx * chunkSize + idx}:
                  </DtdLeft>
                  <Dtd
                    className={`${tag == pr ? "bg-veryGood" : "bg-neutral"}`}
                  >
                    <div className="text-center">
                      <span>{displayValue(pr)}</span>
                    </div>
                  </Dtd>
                </Dtr>
              ))}
            </Dtbody>
          </Dtable>
        ))}
      </div>
    </div>
  );
};

export default DisplayMapTable;
