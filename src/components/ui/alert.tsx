import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 rounded-lg border px-4 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-5",
  {
    variants: {
      variant: {
        default: "border-border-default bg-background-surface text-text-primary",
        info: "border-info/50 bg-info/10 text-text-primary [&>svg]:text-info",
        success: "border-success/50 bg-success/10 text-text-primary [&>svg]:text-success",
        warning: "border-warning/50 bg-warning/10 text-text-primary [&>svg]:text-warning",
        error: "border-error/60 bg-error/10 text-text-primary [&>svg]:text-error",
        destructive: "border-error/60 bg-error/10 text-text-primary [&>svg]:text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  live?: "off" | "polite" | "assertive";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, live = "polite", role, ...props }, ref) => (
    <div
      ref={ref}
      role={role ?? (live === "assertive" ? "alert" : "status")}
      aria-live={live}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("col-start-2 font-semibold leading-snug text-text-primary", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "col-start-2 text-sm leading-relaxed text-text-secondary [&_a]:font-semibold [&_a]:text-accent-primary [&_a]:underline-offset-4 [&_a:hover]:underline",
      className,
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
