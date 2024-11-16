import React from "react";
import * as Constants from "@/lib/constants";

type DisplayFree_PRProps = {
  className: string;
  free_PR: number[];
};

const DisplayFree_PR: React.FC<DisplayFree_PRProps> = ({
  className,
  free_PR,
}) => {
  return (
    <>
      <div className={`${className} inline-flex flex-col items-center`}>
        <div className="overflow-hidden rounded-lg border table-border-color">
          <table className="w-full border-collapse">
            <thead className="bg-slate-300">
              <tr>
                <th className="text-sm p-2">Free_PR</th>
              </tr>
            </thead>
            <tbody>
              {free_PR.map((tag, idx) => {
                const displayTag = Number.isNaN(tag) ? "XX" : tag;

                const color =
                  Number.isNaN(tag) || tag == 0 ? "bg-red-200" : "bg-green-200";

                return (
                  <tr key={idx}>
                    <td
                      className={`text-sm text-center bg-gray-200 border-t table-border-color ${color}`}
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
    </>
  );
};

export default DisplayFree_PR;
