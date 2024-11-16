import React from "react";
import { chunkArray } from "@/lib/tsutils";

type DisplayFrizzyListProps = {
  className: string;
  freeList: string[];
  readyBits: string[];
};

const DisplayFrizzyList: React.FC<DisplayFrizzyListProps> = ({
  className,
  freeList,
  readyBits,
}) => {
  if (freeList.length !== readyBits.length) {
    return <div>Invalid free list and ready bits</div>;
  }

  const chunkSize = 16;
  const freeListChunks = chunkArray(freeList, chunkSize);
  const readyBitsChunks = chunkArray(readyBits, chunkSize);

  return (
    <div className={`flex-col justify-items-center ${className}`}>
      <h2 className="text-lg font-semibold">Free + Ready List</h2>
      <div className="mb-4 overflow-hidden rounded-lg border table-border-color">
        <table className="border-collapse w-full">
          <thead className="bg-slate-300">
            <tr>
              <th className="text-sm p-1" colSpan={freeListChunks.length}>
                PR #
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: chunkSize }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {freeListChunks.map((freeChunk, colIdx) => {
                  const globalIdx = colIdx * chunkSize + rowIdx;
                  if (globalIdx >= freeList.length) {
                    return (
                      <td key={globalIdx} className="bg-gray-100">
                        &nbsp;
                      </td>
                    );
                  }
                  const prNumber = globalIdx.toString();
                  const free = freeChunk[rowIdx];
                  const ready = readyBitsChunks[colIdx][rowIdx];

                  return (
                    <td
                      key={globalIdx}
                      className={`text-center text-sm border-t ${
                        colIdx === 0 ? "" : "border-l"
                      } table-border-color ${
                        free === "1" ? "bg-green-200" : "bg-gray-200"
                      }`}
                    >
                      <div className="flex px-3 space-x-1">
                        <span className="w-4">{prNumber}</span>
                        <span className="flex items-center">
                          {ready === "1" ? "+" : "\u00A0"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayFrizzyList;

// const DisplayFrizzyList: React.FC<DisplayFrizzyListProps> = ({
//   className,
//   freeList,
//   readyBits,
// }) => {
//   if (freeList.length !== readyBits.length) {
//     return <div>Invalid free list and ready bits</div>;
//   }

//   const chunkSize = 16;
//   const freeListChunks = chunkArray(freeList, chunkSize);
//   const readyBitsChunks = chunkArray(readyBits, chunkSize);

//   return (
//     <>
//       <div className={`flex-col justify-items-center ${className}`}>
//         <h2 className="text-lg font-semibold">Free + Ready List</h2>
//         <div className="flex space-x-1">
//           {freeListChunks.map((freeChunk, chunkIdx) => (
//             <div
//               key={chunkIdx}
//               className="mb-4 overflow-hidden rounded-lg border table-border-color"
//             >
//               <table className="border-collapse">
//                 <thead>
//                   <tr className="bg-slate-300">
//                     <th className="text-sm p-1">PR #</th>
//                     {/* <th className="text-sm border-l table-border-color p-2">
//                       Free
//                     </th> */}
//                     {/* <th className="text-sm border-l table-border-color p-2">
//                       Ready
//                     </th> */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {freeChunk.map((frizzy_data, idx) => {
//                     const globalIdx = chunkIdx * chunkSize + idx;
//                     const prNumber = globalIdx.toString();
//                     const free = freeChunk[idx];
//                     const ready = readyBitsChunks[chunkIdx][idx];

//                     return (
//                       <tr key={globalIdx} className="">
//                         <td
//                           className={`text-center text-sm border-t table-border-color ${
//                             free === "1" ? "bg-green-200" : "bg-gray-200"
//                           }`}
//                         >
//                           <div className="flex px-3 space-x-1">
//                             <span className="w-4">{prNumber}</span>
//                             <span className={"flex items-center"}>
//                               {readyBits[globalIdx] === "1" ? "+" : "\u00A0"}
//                             </span>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default DisplayFrizzyList;
