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
    <div className={className}>
      <div className="overflow-hidden rounded-lg border ROB-border-color">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 bg-slate-300">Tag</th>
            </tr>
          </thead>
          <tbody>
            {CDBData.map((tag, idx) => (
              <tr key={idx}>
                <td className="text-center bg-gray-200 border-t ROB-border-color">
                  p{tag}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayCDBData;
