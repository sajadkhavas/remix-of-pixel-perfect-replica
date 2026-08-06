import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-input bg-background-surface px-3 py-2 text-base text-text-primary shadow-sm transition-[background-color,border-color,box-shadow] duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary placeholder:text-text-muted hover:border-border-strong focus-visible:border-focus-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-error aria-invalid:ring-error/30 disabled:cursor-not-allowed disabled:bg-background-surface disabled:text-text-disabled disabled:opacity-[var(--opacity-disabled)] read-only:border-border-subtle read-only:bg-background-canvas read-only:text-text-secondary md:text-sm",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
