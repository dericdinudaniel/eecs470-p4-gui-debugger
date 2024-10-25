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
      <table>
        <thead className="border ROB-border-color bg-slate-300">
          <tr>
            <th className="p-2">Tag</th>
          </tr>
        </thead>
        <tbody>
          {CDBData.map((tag, idx) => (
            <tr key={idx} className="border ROB-border-color bg-gray-200">
              <td className="text-center">p{tag}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayCDBData;
