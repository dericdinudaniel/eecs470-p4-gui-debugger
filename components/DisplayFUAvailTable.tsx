import React from "react";
import { constantsStore as Constants } from "@/lib/constants-store";
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
  storeAvail: string;
  loadAvail: string;
}

const DisplayFUAvailTable: React.FC<FUTableProps> = ({
  className,
  aluAvail,
  branchAvail,
  multAvail,
  storeAvail,
  loadAvail,
}) => {
  const numAlu = Constants.get("NUM_FU_ALU");
  const numBranch = Constants.get("NUM_FU_BRANCH");
  const numMult = Constants.get("NUM_FU_MULT");
  const numStore = Constants.get("NUM_FU_STORE");
  const numLoad = Constants.get("NUM_FU_LOAD");

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
    {
      name: "Store",
      avail: binaryToArray(storeAvail, numStore),
      count: numStore,
    },
    { name: "Load", avail: binaryToArray(loadAvail, numLoad), count: numLoad },
  ];

  // Find the maximum number of FUs to determine number of columns
  const maxFUs = Math.max(numAlu, numBranch, numMult, numStore, numLoad);

  return (
    <div className={`${className} justify-items-center`}>
      <p className="font-semibold">FU Avail</p>
      <Dtable>
        <Dthead>
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
            <Dtr key={fu.name} className="bg-neutral">
              <Dtd>{fu.name}</Dtd>
              {fu.avail.map((value, i) => (
                <Dtd key={i} className={`${value == 1 ? "bg-good" : "bg-bad"}`}>
                  {Number.isNaN(value) ? "x" : value}
                </Dtd>
              ))}
              {/* empty */}
              {[...Array(maxFUs - fu.count)].map((_, i) => (
                <Dtd key={i + fu.count} />
              ))}
            </Dtr>
          ))}
        </Dtbody>
      </Dtable>
    </div>
  );
};

export default DisplayFUAvailTable;
