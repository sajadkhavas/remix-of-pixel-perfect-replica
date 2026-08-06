import * as React from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle, type AlertProps } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type StatusTone = "info" | "success" | "warning" | "error";
type StatusMessageBaseProps = Omit<AlertProps, "variant" | "live" | "title">;

const toneConfig = {
  info: { icon: Info, live: "polite" as const },
  success: { icon: CheckCircle2, live: "polite" as const },
  warning: { icon: TriangleAlert, live: "polite" as const },
  error: { icon: AlertCircle, live: "assertive" as const },
};

export interface StatusMessageProps extends StatusMessageBaseProps {
  tone?: StatusTone;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

function StatusMessageRender(props: StatusMessageProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const {
    className,
    tone = "info",
    title,
    description,
    action,
    icon,
    children,
    ...restProps
  } = props;
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <Alert ref={ref} variant={tone} live={config.live} className={className} {...restProps}>
      {icon ?? <Icon aria-hidden="true" />}
      <AlertTitle>{title}</AlertTitle>
      {description || children || action ? (
        <AlertDescription>
          {description ?? children}
          {action ? <div className="mt-3 flex flex-wrap gap-2">{action}</div> : null}
        </AlertDescription>
      ) : null}
    </Alert>
  );
}

const StatusMessage = React.forwardRef(StatusMessageRender);
StatusMessage.displayName = "StatusMessage";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  compact?: boolean;
}

function EmptyStateRender(props: EmptyStateProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const { className, title, description, action, icon, compact = false, ...restProps } = props;

  return (
    <section
      ref={ref}
      aria-label={typeof title === "string" ? title : undefined}
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-border-default bg-background-surface text-center",
        compact ? "gap-3 p-6" : "gap-4 px-6 py-12",
        className,
      )}
      {...restProps}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-full bg-background-elevated text-text-secondary [&_svg]:size-6"
        >
          {icon}
        </div>
      ) : null}
      <div className="grid max-w-md gap-2">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {description ? (
          <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex flex-wrap justify-center gap-2">{action}</div> : null}
    </section>
  );
}

const EmptyState = React.forwardRef(EmptyStateRender);
EmptyState.displayName = "EmptyState";

export interface ErrorStateProps extends Omit<EmptyStateProps, "icon"> {
  icon?: React.ReactNode;
  errorId?: string;
}

function ErrorStateRender(props: ErrorStateProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const { className, icon, errorId, ...restProps } = props;

  return (
    <EmptyState
      ref={ref}
      role="alert"
      data-error-id={errorId}
      icon={icon ?? <AlertCircle />}
      className={cn("border-error/50", className)}
      {...restProps}
    />
  );
}

const ErrorState = React.forwardRef(ErrorStateRender);
ErrorState.displayName = "ErrorState";

export { StatusMessage, EmptyState, ErrorState };
