import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SignalData, ScopeData } from "@/lib/tstypes";

type DisplaySingleSignalProps = {
  className: string;
  signalData: ScopeData;
};

const DisplaySingleSignal: React.FC<DisplaySingleSignalProps> = ({
  className,
  signalData,
}) => {
  const [flattenedSignals, setFlattenedSignals] = useState<
    { path: string; signal: SignalData }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSignal, setSelectedSignal] = useState<{
    path: string;
    signal: SignalData;
  } | null>(null);

  // Helper function to flatten the scope data into an array of signals with paths
  const flattenScopeData = (
    scope: ScopeData,
    path = ""
  ): { path: string; signal: SignalData }[] => {
    let signals: { path: string; signal: SignalData }[] = [];
    for (const key in scope) {
      const newPath = path ? `${path}.${key}` : key;
      const entry = scope[key];

      if (entry && typeof entry === "object" && "children" in entry) {
        signals = signals.concat(
          flattenScopeData(entry.children as ScopeData, newPath)
        );
      } else if (entry && typeof entry === "object") {
        signals.push({ path: newPath, signal: entry as SignalData });
      }
    }
    return signals;
  };

  useEffect(() => {
    // Flatten the signal data whenever signalData changes
    const flattened = flattenScopeData(signalData);
    setFlattenedSignals(flattened);

    // Clear selected signal if it no longer exists in the new signalData
    if (
      selectedSignal &&
      !flattened.some((item) => item.path === selectedSignal.path)
    ) {
      setSelectedSignal(null);
    }
  }, [signalData]);

  // Watch `selectedSignal`'s changes in case its data needs to refresh
  useEffect(() => {
    if (selectedSignal) {
      const updatedSignal = flattenedSignals.find(
        (item) => item.path === selectedSignal.path
      );
      if (updatedSignal) {
        setSelectedSignal(updatedSignal); // Update with refreshed data
      }
    }
  }, [flattenedSignals]);

  const handleSelectSignal = (signal: { path: string; signal: SignalData }) => {
    setSelectedSignal(signal);
  };

  const filteredSignals = flattenedSignals.filter((item) =>
    item.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${className} bg-card-foreground p-2 rounded-lg shadow-md`}>
      {/* <p className="text-lg font-semibold">Display Single Signal</p> */}
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 border rounded-md text-sm">
          {selectedSignal ? selectedSignal.path : "Select a signal"}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full p-4 max-h-64 overflow-y-auto">
          <Input
            placeholder="Search signals"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()} // Prevents shortcuts from triggering
            className="mb-2"
          />
          {filteredSignals.length > 0 ? (
            filteredSignals.map((item) => (
              <DropdownMenuItem
                key={item.path}
                onClick={() => handleSelectSignal(item)}
              >
                {item.path}
              </DropdownMenuItem>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No results found</p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedSignal && (
        <div className="mt-2 p-2 border rounded-md">
          <h4 className="font-semibold">{selectedSignal.path}</h4>
          <p className="text-sm">Type: {selectedSignal.signal.type.sigType}</p>
          <p className="text-sm">Width: {selectedSignal.signal.type.width}</p>
          <p className="text-sm">Value: {selectedSignal.signal.value}</p>
        </div>
      )}
    </div>
  );
};

export default DisplaySingleSignal;
