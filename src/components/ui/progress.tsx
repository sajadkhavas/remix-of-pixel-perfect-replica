"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

type ProgressElement = React.ElementRef<typeof ProgressPrimitive.Root>;
type ProgressRootProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>;

export interface ProgressProps extends ProgressRootProps {
  indicatorClassName?: string;
}

const Progress = React.forwardRef<ProgressElement, ProgressProps>(
  ({ className, indicatorClassName, value = 0, ...props }, ref) => {
    const normalizedValue = Math.min(100, Math.max(0, value ?? 0));

    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={normalizedValue}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-background-elevated",
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full bg-accent-primary transition-[inline-size] duration-200 ease-out motion-reduce:transition-none",
            indicatorClassName,
          )}
          style={{ inlineSize: `${normalizedValue}%` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
