import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-[var(--opacity-disabled)] motion-safe:active:scale-[var(--motion-scale-pressed)] [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-accent-primary text-primary-foreground hover:bg-accent-hover active:bg-accent-active",
        destructive:
          "bg-error text-destructive-foreground hover:bg-error/90 active:bg-error/80",
        outline:
          "border-border-default bg-background-surface text-text-primary hover:border-border-strong hover:bg-background-elevated",
        secondary:
          "border-border-subtle bg-background-elevated text-text-primary hover:border-border-default hover:bg-background-surface",
        ghost: "text-text-primary hover:bg-accent-muted active:bg-accent-muted/80",
        link: "min-h-0 rounded-sm border-0 px-0 text-accent-primary underline-offset-4 hover:text-accent-hover hover:underline",
      },
      size: {
        default: "h-11",
        sm: "h-11 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-11 p-0",
        "icon-sm": "size-11 p-0 [&_svg]:size-4",
        "icon-lg": "size-12 p-0 [&_svg]:size-6",
      },
      width: {
        auto: "w-auto",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "auto",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      width,
      asChild = false,
      loading = false,
      loadingText,
      disabled,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    };

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, width, className }))}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        data-loading={loading ? "true" : undefined}
        disabled={asChild ? undefined : isDisabled}
        onClick={handleClick}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading ? <Spinner aria-hidden="true" /> : null}
            <span>{loading && loadingText ? loadingText : children}</span>
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
