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
import { useDisplayContext } from "./DisplayContext";

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
  const { tag } = useDisplayContext();

  return (
    <div className={`justify-items-center ${className}`}>
      <p className="font-semibold">{isEarlyCDB ? "Early CDB" : "CDB"}</p>

      <Dtable>
        <Dthead>
          <Dtr>
            <Dth className="p-1">Tag</Dth>
            {CDBData && <Dth className="p-1 w-20">Data</Dth>}
          </Dtr>
        </Dthead>
        <Dtbody>
          {CDBTags.map((cdbTag, idx) => {
            const displayTag = Number.isNaN(cdbTag) ? "XX" : cdbTag;
            const displayVal = CDBData
              ? Number.isNaN(CDBData[idx])
                ? "XX"
                : displayValueHex(CDBData[idx])
              : "XX";

            const valid = !(Number.isNaN(cdbTag) || cdbTag == 0);
            let color = valid ? "bg-good" : "bg-bad";
            if (valid && tag == cdbTag) {
              color = "bg-tagSearchHit";
            }

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
  );
};

export default DisplayCDBData;
