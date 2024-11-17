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
        "bg-gray-500/[.15] rounded-lg shadow-lg p-3 inline-flex flex-col items-center",
        className
      )}
      {...props}
    />
  </div>
));
ModuleBase.displayName = "ModuleBase";

export { ModuleBase };
