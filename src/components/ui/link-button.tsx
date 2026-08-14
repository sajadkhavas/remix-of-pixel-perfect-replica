import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "aria-disabled">;
type LinkButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface LinkButtonProps extends AnchorProps, LinkButtonVariantProps {
  disabled?: boolean;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>((componentProps, ref) => {
  const {
    className,
    variant,
    size,
    width,
    disabled = false,
    href,
    onClick,
    ...props
  } = componentProps;

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
      tabIndex={disabled ? 0 : props.tabIndex}
      className={cn(buttonVariants({ variant, size, width, className }))}
      onClick={handleClick}
      {...props}
    />
  );
});
LinkButton.displayName = "LinkButton";

export { LinkButton };
