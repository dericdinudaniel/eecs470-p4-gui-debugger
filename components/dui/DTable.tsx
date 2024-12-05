import * as React from "react";
import { cn } from "@/lib/utils";

const Dthead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-tableHeader border-b", className)}
    {...props}
  />
));
Dthead.displayName = "Dthead";

const DtdLeft = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("text-right text-sm", className)} {...props} />
));
DtdLeft.displayName = "DtdLeft";

const Dtd = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("text-center text-sm", className)} {...props} />
));
Dtd.displayName = "Dtd";

const DthLeft = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("text-sm px-4", className)} {...props} />
));
DthLeft.displayName = "DthLeft";

const Dth = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("text-sm px-2 py-1", className)} {...props} />
));
Dth.displayName = "Dth";

const Dtr = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("table-col-border", className)} {...props} />
));
Dtr.displayName = "Dtr";

const Dtbody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("table-row-border", className)} {...props} />
));
Dtbody.displayName = "Dtbody";

const Dtable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="overflow-hidden border rounded-lg w-fit">
    <table
      ref={ref}
      className={cn("w-full border-collapse", className)} // Apply width from className
      {...props}
    />
  </div>
));
Dtable.displayName = "Dtable";

export { Dthead, Dtd, DtdLeft, Dth, DthLeft, Dtr, Dtbody, Dtable };
