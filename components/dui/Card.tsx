import * as React from "react";
import { cn } from "@/lib/utils";

// Create the context
interface CardContextType {
  visible: boolean;
  toggleContent: () => void;
}
const CardContext = React.createContext<CardContextType | undefined>(undefined);

// Hook to use the CardContext
const useCardContext = () => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context;
};

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
  label: string; // Prop for the label text
  afterClassName?: string; // Prop for the class name of the element after the label
  parentClassName?: string; // Prop for the class name of the container
}
const CardHeader = React.forwardRef<HTMLButtonElement, CardHeaderProps>(
  (
    { label, parentClassName, afterClassName, className, children, ...props },
    ref
  ) => {
    const { toggleContent } = useCardContext(); // Get toggleContent from context
    return (
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
    );
  }
);
CardHeader.displayName = "CardHeader";

interface CardHeaderSmallProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // Prop for the label text
  afterClassName?: string; // Prop for the class name of the element after the label
  parentClassName?: string; // Prop for the class name of the container
}
const CardHeaderSmall = React.forwardRef<
  HTMLButtonElement,
  CardHeaderSmallProps
>(
  (
    { label, parentClassName, afterClassName, className, children, ...props },
    ref
  ) => {
    const { toggleContent } = useCardContext(); // Get toggleContent from context
    return (
      <div className={cn("flex items-center", parentClassName)}>
        <button
          ref={ref}
          className={cn("font-semibold", className)}
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
CardHeaderSmall.displayName = "CardHeaderSmall";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    const { visible } = useCardContext(); // Get visible from context
    if (!visible) return null; // Render nothing if not visible

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
const Card: React.FC<CardProps> = ({
  display = true,
  children,
  className,
  ...props
}) => {
  const [visible, setVisible] = React.useState(true);

  const toggleContent = () => setVisible((prev) => !prev);

  return (
    <CardContext.Provider value={{ visible, toggleContent }}>
      <CardBase display={display} className={className} {...props}>
        {children}
      </CardBase>
    </CardContext.Provider>
  );
};

export { CardBase, CardHeader, CardHeaderSmall, CardContent, Card };
