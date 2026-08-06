import * as React from "react";

import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, "aria-hidden": ariaHidden = true, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden={ariaHidden}
      className={cn("skeleton-shimmer rounded-md", className)}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
