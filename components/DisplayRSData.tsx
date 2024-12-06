import React from "react";
import * as Types from "@/lib/types";
import { ScopeData } from "@/lib/tstypes";
import DisplaySingleRS from "./DisplaySingleRS";
import { Card } from "./dui/Card";
import {
  extractSignalValue,
  extractSignalValueToBool,
  extractSignalValueToInt,
  parseSQ_DATA_List,
} from "@/lib/utils";

type DisplayRSDataProps = {
  className: string;
  RSData: Types.RS_DATA[];
  EarlyCDB: Types.PHYS_REG_TAG[];
  signalSQ: ScopeData;
};

const DisplayRSData: React.FC<DisplayRSDataProps> = ({
  className,
  RSData,
  EarlyCDB,
  signalSQ,
}) => {
  // SQ !!!, to do highlighting of SQ IDX if all previous stores have calculated addrs
  const SQ_entries = parseSQ_DATA_List(
    extractSignalValue(signalSQ, "entries").value
  );
  const SQ_head = extractSignalValueToInt(signalSQ, "head");
  const SQ_empty = extractSignalValueToBool(signalSQ, "empty");
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
                SQ_entries={SQ_entries}
                SQ_head={SQ_head}
                SQ_empty={SQ_empty}
              />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default DisplayRSData;
