import React, { useState } from "react";

type SignalType = {
  sigType: string;
  width: number;
};

type SignalData = {
  name: string;
  type: SignalType;
  value: string;
};

type ScopeData = {
  [key: string]: SignalData | { children: ScopeData };
};

type DebuggerOutputProps = {
  className: string;
  signalData: {
    cycle: string;
    endpoint: string;
    signals: {
      children: ScopeData;
    };
  } | null;
};

const DisplayFormat = {
  HEX: "HEX",
  BINARY: "BINARY",
  DECIMAL: "DECIMAL",
} as const;

const DebuggerOutput: React.FC<DebuggerOutputProps> = ({
  signalData,
  className,
}) => {
  const [displayFormat, setDisplayFormat] = useState<
    keyof typeof DisplayFormat
  >(DisplayFormat.BINARY);

  if (!signalData) {
    return <div className="p-4 bg-gray-100 rounded-lg">Loading data...</div>;
  }

  const renderSignal = (signal: SignalData) => {
    let displayValue = signal.value;

    if (displayFormat === DisplayFormat.HEX) {
      displayValue = parseInt(signal.value, 2).toString(16);
    } else if (displayFormat === DisplayFormat.DECIMAL) {
      displayValue = parseInt(signal.value, 2).toString();
    }

    return (
      <div key={signal.name} className="flex justify-between py-1">
        <span className="font-medium">{signal.name}</span>
        <span className="font-mono">{displayValue}</span>
      </div>
    );
  };

  const renderScope = (scope: ScopeData, level = 0) => {
    return Object.entries(scope).map(([key, value]) => {
      if ("children" in value) {
        return (
          <div key={key} className={`mt-2 ${level > 0 ? "ml-4" : ""}`}>
            <h3 className="font-bold text-lg">{key}</h3>
            {renderScope(value.children, level + 1)}
          </div>
        );
      } else {
        return renderSignal(value);
      }
    });
  };

  return (
    <div className={`p-4 bg-card rounded-lg ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Cycle: {signalData.cycle}</h2>
        <div>
          <label htmlFor="format-select" className="mr-2">
            Display format:
          </label>
          <select
            id="format-select"
            value={displayFormat}
            onChange={(e) =>
              setDisplayFormat(e.target.value as keyof typeof DisplayFormat)
            }
            className="p-1 border rounded"
          >
            <option value={DisplayFormat.BINARY}>Binary</option>
            <option value={DisplayFormat.HEX}>Hex</option>
            <option value={DisplayFormat.DECIMAL}>Decimal</option>
          </select>
        </div>
      </div>
      {renderScope(signalData.signals.children)}
    </div>
  );
};

export default DebuggerOutput;
