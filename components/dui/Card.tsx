import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

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

const CardHeader = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "font-semibold text-lg text-left flex flex-col items-start",
      className
    )}
    {...props}
  >
    <span>{props.children}</span>
    <Separator className="mt-[-.35rem]" />
  </button>
));
CardHeader.displayName = "CardHeader";

const CardHeaderSmall = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("font-semibold", className)} {...props} />
));
CardHeaderSmall.displayName = "CardHeaderSmall";

export { CardBase, CardHeader, CardHeaderSmall };
