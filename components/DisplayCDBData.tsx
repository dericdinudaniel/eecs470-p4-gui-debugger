import * as Types from "@/lib/types";
import { displayValueHex } from "@/lib/utils";
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

type DisplayCDBDataProps = {
  className: string;
  CDBTags: Types.PHYS_REG_TAG[];
  CDBData?: Types.DATA[];
  isEarlyCDB: boolean;
};

const DisplayCDBData: React.FC<DisplayCDBDataProps> = ({
  className,
  CDBTags,
  CDBData,
  isEarlyCDB,
}) => {
  return (
    <div className={`justify-items-center ${className}`}>
      <p className="font-semibold">{isEarlyCDB ? "Early CDB" : "CDB"}</p>
      <div className="">
        <Dtable>
          <Dthead>
            <Dtr>
              <Dth className="p-1">Tag</Dth>
              {CDBData && <Dth className="p-1 w-20">Data</Dth>}
            </Dtr>
          </Dthead>
          <Dtbody>
            {CDBTags.map((tag, idx) => {
              const displayTag = Number.isNaN(tag) ? "XX" : tag;
              const displayVal = CDBData
                ? Number.isNaN(CDBData[idx])
                  ? "XX"
                  : displayValueHex(CDBData[idx])
                : "XX";

              const color =
                Number.isNaN(tag) || tag == 0 ? "bg-bad" : "bg-good";

              return (
                <Dtr key={idx}>
                  <DtdLeft className={`text-center ${color}`}>
                    p{displayTag}
                  </DtdLeft>
                  {CDBData && <Dtd className={`${color}`}>{displayVal}</Dtd>}
                </Dtr>
              );
            })}
          </Dtbody>
        </Dtable>
      </div>
    </div>
  );
};

export default DisplayCDBData;
