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
        "bg-card rounded-lg shadow-lg p-3 inline-flex flex-col items-center",
        className
      )}
      {...props}
    />
  </div>
));
ModuleBase.displayName = "ModuleBase";

const ModuleHeader: React.FC<React.ComponentProps<"button">> = ({
  className,
  ...props
}) => (
  <button
    className={cn("text-xl font-semibold underline-fade", className)}
    {...props}
  />
);

export { ModuleBase, ModuleHeader };
