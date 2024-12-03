import * as React from "react";
import { cn } from "@/lib/utils";

interface SimpleValDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  labelClassName?: string;
  dataClassName?: string;
  children?: React.ReactNode;
}

const SimpleValDisplay = React.forwardRef<
  HTMLDivElement,
  SimpleValDisplayProps
>(
  (
    { label, labelClassName, dataClassName, className, children, ...props },
    ref
  ) => (
    <div ref={ref} className={cn("", className)} {...props}>
      <span className={cn("font-bold text-sm", labelClassName)}>{label}</span>
      <span className={cn("text-sm", dataClassName)}>{children}</span>
    </div>
  )
);

SimpleValDisplay.displayName = "SimpleValDisplay";

export { SimpleValDisplay };
