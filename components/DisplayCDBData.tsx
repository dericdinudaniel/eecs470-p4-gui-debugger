import * as Types from "@/lib/types";

type DisplayCDBDataProps = {
  className: string;
  CDBData: Types.PHYS_REG_TAG[];
};

const DisplayCDBData: React.FC<DisplayCDBDataProps> = ({
  className,
  CDBData,
}) => {
  return (
    <div className={`${className}`}>
      <div className="overflow-hidden rounded-lg border ROB-border-color">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-sm p-2 bg-slate-300">Tag</th>
            </tr>
          </thead>
          <tbody>
            {CDBData.map((tag, idx) => {
              const displayTag = Number.isNaN(tag) ? "XX" : tag;

              const color =
                Number.isNaN(tag) || tag == 0 ? "bg-red-200" : "bg-green-200";

              return (
                <tr key={idx}>
                  <td
                    className={`text-sm text-center bg-gray-200 border-t ROB-border-color ${color}`}
                  >
                    p{displayTag}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayCDBData;
