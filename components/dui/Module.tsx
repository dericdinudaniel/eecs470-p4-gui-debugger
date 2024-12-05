import * as React from "react";
import { cn } from "@/lib/utils";

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
  label: string; // Prop for the label text
  afterClassName?: string; // Prop for the class name of the element after the label
  parentClassName?: string; // Prop for the class name of the element after the label
}

const ModuleHeader = React.forwardRef<HTMLButtonElement, ModuleHeaderProps>(
  (
    {
      label,
      parentClassName,
      afterClassName,
      toggleContent,
      className,
      children,
      ...props
    },
    ref
  ) => (
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
  )
);

ModuleHeader.displayName = "ModuleHeader";

interface ModuleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean; // Control visibility of the content
}
const ModuleContent = React.forwardRef<HTMLDivElement, ModuleContentProps>(
  ({ className, visible = true, ...props }, ref) => {
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

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // Ensure child type is inferred correctly
    if ((child.type as any).displayName === "ModuleHeader") {
      return React.cloneElement(child, { toggleContent } as ModuleHeaderProps);
    }

    if ((child.type as any).displayName === "ModuleContent") {
      return React.cloneElement(child, { visible } as ModuleContentProps);
    }

    return child;
  });

  return (
    <ModuleBase className={className} {...props}>
      {enhancedChildren}
    </ModuleBase>
  );
};

export { ModuleBase, ModuleHeader, ModuleContent, Module };
