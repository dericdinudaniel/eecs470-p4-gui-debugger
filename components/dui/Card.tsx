import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  display?: boolean; // Optional prop to control visibility
}
const CardBase = React.forwardRef<HTMLDivElement, CardBaseProps>(
  ({ className, display = true, ...props }, ref) => {
    if (!display) return null; // Render nothing if display is false

    return (
      <div
        ref={ref}
        className={cn(
          "justify-items-center bg-card-foreground shadow-lg rounded-lg p-2 w-fit",
          className
        )}
        {...props}
      />
    );
  }
);
CardBase.displayName = "CardBase";

interface CardHeaderProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  toggleContent?: () => void;
  label: string; // Prop for the label text
  afterClassName?: string; // Prop for the class name of the element after the label
  parentClassName?: string; // Prop for the class name of the element after the label
}
const CardHeader = React.forwardRef<HTMLButtonElement, CardHeaderProps>(
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
        className={cn(
          "font-semibold text-lg text-left flex flex-col items-start underline hover:text-foreground/50",
          className
        )}
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
CardHeader.displayName = "CardHeader";

const CardHeaderSmall = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("font-semibold", className)} {...props} />
));
CardHeaderSmall.displayName = "CardHeaderSmall";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean; // Control visibility of the content
}
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, visible = true, ...props }, ref) => {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={cn("mt-0 justify-items-center", className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  display?: boolean; // Optional prop to control visibility
}
const Card = ({ display = true, children, className, ...props }: CardProps) => {
  const [visible, setVisible] = React.useState(true);

  const toggleContent = () => setVisible((prev) => !prev);

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // Ensure child type is inferred correctly
    if ((child.type as any).displayName === "CardHeader") {
      return React.cloneElement(child, { toggleContent } as CardHeaderProps);
    }

    if ((child.type as any).displayName === "CardContent") {
      return React.cloneElement(child, { visible } as CardContentProps);
    }

    return child;
  });

  return (
    <CardBase display={display} className={className} {...props}>
      {enhancedChildren}
    </CardBase>
  );
};

export { CardBase, CardHeader, CardHeaderSmall, CardContent, Card };
