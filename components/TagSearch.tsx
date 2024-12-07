import React from "react";

interface TagSearchContextValue {
  tag: number;
  setTag: (tag: number) => void;
}
const TagSearchContext = React.createContext<TagSearchContextValue | undefined>(
  undefined
);
const useTagSearchContext = () => {
  const context = React.useContext(TagSearchContext);
  if (!context) {
    throw new Error(
      "useTagSearchContext must be used within a TagSearchProvider"
    );
  }
  return context;
};
const TagSearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tag, setTag] = React.useState(0);

  return (
    <TagSearchContext.Provider value={{ tag, setTag }}>
      {children}
    </TagSearchContext.Provider>
  );
};

export { TagSearchProvider, useTagSearchContext };
