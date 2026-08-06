import * as React from "react";

import { cn } from "@/lib/utils";

const VisuallyHidden = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("sr-only", className)} {...props} />
  ),
);
VisuallyHidden.displayName = "VisuallyHidden";

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string;
}

const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ className, targetId = "main-content", children = "رفتن به محتوای اصلی", ...props }, ref) => (
    <a
      ref={ref}
      href={`#${targetId}`}
      className={cn(
        "fixed start-4 top-4 z-[var(--z-toast)] -translate-y-24 rounded-md bg-background-inverse px-4 py-3 font-semibold text-text-inverse shadow-[var(--shadow-elevated)] transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:ring-offset-background",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  ),
);
SkipLink.displayName = "SkipLink";

export { VisuallyHidden, SkipLink };
