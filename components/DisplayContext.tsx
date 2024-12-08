import React from "react";

interface DisplayContextValue {
  tag: number;
  setTag: (tag: number) => void;
  signalData: any;
}
const DisplayContext = React.createContext<DisplayContextValue | undefined>(
  undefined
);
const useDisplayContext = () => {
  const context = React.useContext(DisplayContext);
  if (!context) {
    throw new Error(
      "useDisplayContext must be used within a DisplayContextProvider"
    );
  }
  return context;
};
const DisplayContextProvider: React.FC<{
  children: React.ReactNode;
  signalData: any;
}> = ({ children, signalData }) => {
  const [tag, setTag] = React.useState(-1);

  return (
    <DisplayContext.Provider value={{ tag, setTag, signalData }}>
      {children}
    </DisplayContext.Provider>
  );
};

export { DisplayContextProvider, useDisplayContext };
