import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "aria-disabled">,
    VariantProps<typeof buttonVariants> {
  disabled?: boolean;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, width, disabled = false, href, onClick, ...props }, ref) => {
    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    };

    return (
      <a
        ref={ref}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : props.tabIndex}
        className={cn(buttonVariants({ variant, size, width, className }))}
        onClick={handleClick}
        {...props}
      />
    );
  },
);
LinkButton.displayName = "LinkButton";

export { LinkButton };
