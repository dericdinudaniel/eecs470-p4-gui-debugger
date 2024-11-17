import React from "react";
import * as Constants from "@/lib/constants";
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
      <Dtable>
        <Dthead className="bg-slate-300">
          <Dtr>
            <Dth className="p-2">FU Type</Dth>
            {[...Array(maxFUs)].map((_, i) => (
              <Dth key={i} className="p-2">
                {i}
              </Dth>
            ))}
          </Dtr>
        </Dthead>
        <Dtbody>
          {fuTypes.map((fu, rowIdx) => (
            <Dtr key={fu.name}>
              <Dtd className="">{fu.name}</Dtd>
              {fu.avail.map((value, i) => (
                <Dtd key={i} className={`${value == 1 ? "bg-good" : "bg-bad"}`}>
                  {Number.isNaN(value) ? "x" : value}
                </Dtd>
              ))}
            </Dtr>
          ))}
        </Dtbody>
      </Dtable>
    </div>
  );
};

export default DisplayFUAvailTable;
