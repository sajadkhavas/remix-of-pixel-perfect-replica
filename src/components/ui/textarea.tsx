import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full resize-y rounded-md border border-input bg-background-surface px-3 py-2 text-base text-text-primary shadow-sm transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-text-muted hover:border-border-strong focus-visible:border-focus-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-error aria-invalid:ring-error/30 disabled:cursor-not-allowed disabled:bg-background-surface disabled:text-text-disabled disabled:opacity-[var(--opacity-disabled)] read-only:border-border-subtle read-only:bg-background-canvas read-only:text-text-secondary md:text-sm",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
