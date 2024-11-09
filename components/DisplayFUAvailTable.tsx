import React from "react";
import * as Constants from "@/lib/constants";

interface FUTableProps {
  className: string;
  aluAvail: string;
  branchAvail: string;
  multAvail: string;
}

const DisplayFUAvailTable: React.FC<FUTableProps> = ({
  className,
  aluAvail,
  branchAvail,
  multAvail,
}) => {
  const numAlu = Constants.NUM_FU_ALU;
  const numBranch = Constants.NUM_FU_BRANCH;
  const numMult = Constants.NUM_FU_MULT;

  // Helper function to convert binary string to array of 1s and 0s
  const binaryToArray = (binary: string, length: number) => {
    // Remove the 'b' prefix and convert to array of numbers
    const digits = binary.replace("b", "").split("").map(Number);
    // Take only the required number of digits from right to left
    return digits.slice(-length);
  };

  const fuTypes = [
    { name: "ALU", avail: binaryToArray(aluAvail, numAlu), count: numAlu },
    {
      name: "Branch",
      avail: binaryToArray(branchAvail, numBranch),
      count: numBranch,
    },
    { name: "Mult", avail: binaryToArray(multAvail, numMult), count: numMult },
  ];

  // Find the maximum number of FUs to determine number of columns
  const maxFUs = Math.max(numAlu, numBranch, numMult);

  return (
    <div className={`${className}`}>
      <div className="overflow-hidden rounded-lg border ROB-border-color">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-sm p-2 bg-slate-300">FU Type</th>
              {[...Array(maxFUs)].map((_, i) => (
                <th
                  key={i}
                  className="text-sm border-l ROB-border-color p-2 bg-slate-300"
                >
                  {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fuTypes.map((fu, rowIdx) => (
              <tr key={fu.name}>
                <td className="text-sm text-center bg-gray-200 border-t border-r ROB-border-color">
                  {fu.name}
                </td>
                {fu.avail.map((value, i) => (
                  <td
                    key={i}
                    className={`text-sm text-center bg-gray-200 border-t border-l ROB-border-color ${
                      value == 1 ? "bg-green-200" : "bg-red-200"
                    }`}
                  >
                    {Number.isNaN(value) ? "x" : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayFUAvailTable;
