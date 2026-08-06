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

type LabelElement = React.ElementRef<typeof Label>;
type LabelProps = React.ComponentPropsWithoutRef<typeof Label>;
type SlotElement = React.ElementRef<typeof Slot>;
type SlotProps = React.ComponentPropsWithoutRef<typeof Slot>;
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>;

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

function FieldRender(props: FieldProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const {
    className,
    invalid = false,
    disabled = false,
    readOnly = false,
    required = false,
    ...restProps
  } = props;
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
        {...restProps}
      />
    </FieldContext.Provider>
  );
}

const Field = React.forwardRef(FieldRender);
Field.displayName = "Field";

function FieldLabelRender(props: LabelProps, ref: React.ForwardedRef<LabelElement>) {
  const { className, children, ...restProps } = props;
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
      {...restProps}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="ms-1 text-error">
          *
        </span>
      ) : null}
    </Label>
  );
}

const FieldLabel = React.forwardRef(FieldLabelRender);
FieldLabel.displayName = "FieldLabel";

function FieldControlRender(props: SlotProps, ref: React.ForwardedRef<SlotElement>) {
  const { "aria-describedby": ariaDescribedBy, ...restProps } = props;
  const context = useFieldContext("FieldControl");
  const describedBy = [
    ariaDescribedBy,
    context.descriptionId,
    context.invalid ? context.errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Slot
      ref={ref}
      id={context.controlId}
      aria-describedby={describedBy || undefined}
      aria-disabled={context.disabled || undefined}
      aria-invalid={context.invalid || undefined}
      aria-readonly={context.readOnly || undefined}
      aria-required={context.required || undefined}
      {...restProps}
    />
  );
}

const FieldControl = React.forwardRef(FieldControlRender);
FieldControl.displayName = "FieldControl";

function FieldDescriptionRender(
  props: ParagraphProps,
  ref: React.ForwardedRef<HTMLParagraphElement>,
) {
  const { className, ...restProps } = props;
  const { descriptionId } = useFieldContext("FieldDescription");

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn("text-sm leading-relaxed text-text-muted", className)}
      {...restProps}
    />
  );
}

const FieldDescription = React.forwardRef(FieldDescriptionRender);
FieldDescription.displayName = "FieldDescription";

function FieldErrorRender(
  props: ParagraphProps,
  ref: React.ForwardedRef<HTMLParagraphElement>,
) {
  const { className, children, ...restProps } = props;
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
      {...restProps}
    >
      {children}
    </p>
  );
}

const FieldError = React.forwardRef(FieldErrorRender);
FieldError.displayName = "FieldError";

export { Field, FieldLabel, FieldControl, FieldDescription, FieldError };
