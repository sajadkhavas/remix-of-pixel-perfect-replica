import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldContextValue = {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useFieldContext(componentName: string) {
  const context = React.useContext(FieldContext);

  if (!context) {
    throw new Error(`${componentName} must be used within <Field>`);
  }

  return context;
}

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      className,
      invalid = false,
      disabled = false,
      readOnly = false,
      required = false,
      ...props
    },
    ref,
  ) => {
    const id = React.useId();
    const value = React.useMemo<FieldContextValue>(
      () => ({
        controlId: `${id}-control`,
        descriptionId: `${id}-description`,
        errorId: `${id}-error`,
        invalid,
        disabled,
        readOnly,
        required,
      }),
      [disabled, id, invalid, readOnly, required],
    );

    return (
      <FieldContext.Provider value={value}>
        <div
          ref={ref}
          className={cn("grid gap-2", className)}
          data-disabled={disabled ? "true" : undefined}
          data-invalid={invalid ? "true" : undefined}
          data-readonly={readOnly ? "true" : undefined}
          {...props}
        />
      </FieldContext.Provider>
    );
  },
);
Field.displayName = "Field";

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, children, ...props }, ref) => {
  const { controlId, disabled, invalid, required } = useFieldContext("FieldLabel");

  return (
    <Label
      ref={ref}
      htmlFor={controlId}
      className={cn(
        "text-sm font-semibold text-text-primary",
        disabled && "text-text-disabled",
        invalid && "text-error",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="ms-1 text-error">
          *
        </span>
      ) : null}
    </Label>
  );
});
FieldLabel.displayName = "FieldLabel";

const FieldControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ "aria-describedby": ariaDescribedBy, ...props }, ref) => {
  const { controlId, descriptionId, errorId, invalid, disabled, readOnly, required } =
    useFieldContext("FieldControl");
  const describedBy = [ariaDescribedBy, descriptionId, invalid ? errorId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <Slot
      ref={ref}
      id={controlId}
      aria-describedby={describedBy || undefined}
      aria-disabled={disabled || undefined}
      aria-invalid={invalid || undefined}
      aria-readonly={readOnly || undefined}
      aria-required={required || undefined}
      {...props}
    />
  );
});
FieldControl.displayName = "FieldControl";

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { descriptionId } = useFieldContext("FieldDescription");

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn("text-sm leading-relaxed text-text-muted", className)}
      {...props}
    />
  );
});
FieldDescription.displayName = "FieldDescription";

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { errorId, invalid } = useFieldContext("FieldError");

  if (!invalid || !children) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={errorId}
      role="alert"
      className={cn("text-sm font-medium leading-relaxed text-error", className)}
      {...props}
    >
      {children}
    </p>
  );
});
FieldError.displayName = "FieldError";

export { Field, FieldLabel, FieldControl, FieldDescription, FieldError };
