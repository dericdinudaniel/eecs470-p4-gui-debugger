import * as React from "react";
import { cn } from "@/lib/utils";

interface ModuleContextValue {
  visible: boolean;
  toggleContent: () => void;
}
const ModuleContext = React.createContext<ModuleContextValue | undefined>(
  undefined
);
const useModuleContext = () => {
  const context = React.useContext(ModuleContext);
  if (!context) {
    throw new Error("useModuleContext must be used within a Module");
  }
  return context;
};

const ModuleBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div>
    <div
      ref={ref}
      className={cn(
        "bg-card rounded-lg shadow-lg p-3 inline-flex flex-col items-center w-fit",
        className
      )}
      {...props}
    />
  </div>
));
ModuleBase.displayName = "ModuleBase";

interface ModuleHeaderProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  toggleContent?: () => void;
  label: string; // label text
  afterClassName?: string; // class name of the element after the label
  parentClassName?: string; // class name of the parent element
}

const ModuleHeader = React.forwardRef<HTMLButtonElement, ModuleHeaderProps>(
  (
    { label, parentClassName, afterClassName, className, children, ...props },
    ref
  ) => {
    const { toggleContent } = useModuleContext();

    return (
      <div className={cn("flex items-center", parentClassName)}>
        <button
          ref={ref}
          className={cn("text-2xl font-semibold underline-fade", className)}
          onClick={toggleContent}
          {...props}
        >
          {label}
        </button>
        {children && (
          <div className={cn("flex items-center", afterClassName)}>
            {children}
          </div>
        )}
      </div>
    );
  }
);

ModuleHeader.displayName = "ModuleHeader";

interface ModuleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean; // Control visibility of the content
}
const ModuleContent = React.forwardRef<HTMLDivElement, ModuleContentProps>(
  ({ className, ...props }, ref) => {
    const { visible } = useModuleContext();

    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={cn("mt-2 justify-items-center", className)}
        {...props}
      />
    );
  }
);
ModuleContent.displayName = "ModuleContent";

interface ModuleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const Module = ({ children, className, ...props }: ModuleProps) => {
  const [visible, setVisible] = React.useState(true);

  const toggleContent = () => setVisible((prev) => !prev);

  return (
    <ModuleContext.Provider value={{ visible, toggleContent }}>
      <ModuleBase className={className} {...props}>
        {children}
      </ModuleBase>
    </ModuleContext.Provider>
  );
};

export { ModuleBase, ModuleHeader, ModuleContent, Module };
