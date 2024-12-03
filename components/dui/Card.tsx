import * as React from "react";
import { cn } from "@/lib/utils";

const CardBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "justify-items-center bg-card-foreground shadow-lg rounded-lg p-2 w-fit",
      className
    )}
    {...props}
  />
));
CardBase.displayName = "CardBase";

export { CardBase };
