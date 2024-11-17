import * as React from "react";
import { cn } from "@/lib/utils";

const DButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600  text-xs",
      className
    )}
    {...props}
  />
));
DButton.displayName = "DButton";
export { DButton };
