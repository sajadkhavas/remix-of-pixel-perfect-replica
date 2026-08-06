import * as React from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  type AlertProps,
} from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type StatusTone = "info" | "success" | "warning" | "error";

const toneConfig = {
  info: { icon: Info, live: "polite" as const },
  success: { icon: CheckCircle2, live: "polite" as const },
  warning: { icon: TriangleAlert, live: "polite" as const },
  error: { icon: AlertCircle, live: "assertive" as const },
};

export interface StatusMessageProps
  extends Omit<AlertProps, "variant" | "live" | "title"> {
  tone?: StatusTone;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const StatusMessage = React.forwardRef<HTMLDivElement, StatusMessageProps>(
  (
    {
      className,
      tone = "info",
      title,
      description,
      action,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const config = toneConfig[tone];
    const Icon = config.icon;

    return (
      <Alert ref={ref} variant={tone} live={config.live} className={className} {...props}>
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
  },
);
StatusMessage.displayName = "StatusMessage";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  compact?: boolean;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, action, icon, compact = false, ...props }, ref) => (
    <section
      ref={ref}
      aria-label={typeof title === "string" ? title : undefined}
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-border-default bg-background-surface text-center",
        compact ? "gap-3 p-6" : "gap-4 px-6 py-12",
        className,
      )}
      {...props}
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
  ),
);
EmptyState.displayName = "EmptyState";

export interface ErrorStateProps extends Omit<EmptyStateProps, "icon"> {
  icon?: React.ReactNode;
  errorId?: string;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ className, icon, errorId, ...props }, ref) => (
    <EmptyState
      ref={ref}
      role="alert"
      data-error-id={errorId}
      icon={icon ?? <AlertCircle />}
      className={cn("border-error/50", className)}
      {...props}
    />
  ),
);
ErrorState.displayName = "ErrorState";

export { StatusMessage, EmptyState, ErrorState };
