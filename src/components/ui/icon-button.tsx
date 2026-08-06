import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

export interface IconButtonProps extends Omit<ButtonProps, "children" | "aria-label"> {
  label: string;
  children: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, children, size = "icon", ...props }, ref) => (
    <Button ref={ref} size={size} aria-label={label} {...props}>
      <span aria-hidden="true" className="contents">
        {children}
      </span>
      <span className="sr-only">{label}</span>
    </Button>
  ),
);
IconButton.displayName = "IconButton";

export { IconButton };
