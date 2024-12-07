import * as React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DHeaderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isPressed?: boolean;
}
const DHeaderButton = React.forwardRef<HTMLButtonElement, DHeaderButtonProps>(
  ({ className, isPressed, ...props }, ref) => (
    <Button
      ref={ref}
      size={"sm"}
      className={cn(
        "duration-100 active:bg-primary/70 h-9 text-sm",
        isPressed ? "bg-primary/70 hover:bg-primary/70" : "",
        className
      )}
      {...props}
    >
      <div className="underline-fade-button py-2">{props.children}</div>
    </Button>
  )
);
DHeaderButton.displayName = "DHeaderButton";

// OLD: bg-blue-500 text-primary-foreground px-1 py-1 rounded hover:bg-blue-600 text-xs
const DButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    size={"sm"}
    className={cn("duration-100 active:bg-primary/70 p-1 h-6", className)}
    {...props}
  >
    <div className="underline-fade">{props.children}</div>
  </Button>
));
DButton.displayName = "DButton";

export { DHeaderButton, DButton };
