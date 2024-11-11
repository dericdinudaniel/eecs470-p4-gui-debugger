import * as Types from "@/lib/types";

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
        <div className="overflow-hidden rounded-lg border ROB-border-color">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-sm p-2 bg-slate-300">Tag</th>
                {CDBData && (
                  <th className="text-sm p-2 bg-slate-300 border-l ROB-border-color">
                    Data
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {CDBTags.map((tag, idx) => {
                const displayTag = Number.isNaN(tag) ? "XX" : tag;
                const displayVal = CDBData ? CDBData[idx] : "XX";

                const color =
                  Number.isNaN(tag) || tag == 0 ? "bg-red-200" : "bg-green-200";

                return (
                  <tr key={idx}>
                    <td
                      className={`text-sm text-center bg-gray-200 border-t ROB-border-color ${color}`}
                    >
                      p{displayTag}
                    </td>
                    {CDBData && (
                      <td
                        className={`text-sm text-center bg-gray-200 border-t border-l ROB-border-color ${color}`}
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
