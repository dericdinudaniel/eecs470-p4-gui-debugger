import * as Types from "@/lib/types";
import { displayValueHex } from "@/lib/utils";

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
        <div className="overflow-hidden rounded-lg border table-border-color">
          <table className="w-full border-collapse">
            <thead className="bg-slate-300">
              <tr>
                <th className="text-sm p-1">Tag</th>
                {CDBData && (
                  <th className="text-sm p-1 border-l table-border-color w-20">
                    Data
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {CDBTags.map((tag, idx) => {
                const displayTag = Number.isNaN(tag) ? "XX" : tag;
                const displayVal = CDBData
                  ? Number.isNaN(CDBData[idx])
                    ? "XX"
                    : displayValueHex(CDBData[idx])
                  : "XX";

                const color =
                  Number.isNaN(tag) || tag == 0 ? "bg-red-200" : "bg-green-200";

                return (
                  <tr key={idx}>
                    <td
                      className={`text-sm text-center bg-gray-200 border-t table-border-color ${color}`}
                    >
                      p{displayTag}
                    </td>
                    {CDBData && (
                      <td
                        className={`text-sm text-center bg-gray-200 border-t border-l table-border-color ${color}`}
                      >
                        {displayVal}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DisplayCDBData;
