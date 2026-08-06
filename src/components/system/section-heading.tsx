import * as React from "react";

import { cn } from "@/lib/utils";

type SectionHeadingBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title">;

export interface SectionHeadingProps extends SectionHeadingBaseProps {
  as?: "h2" | "h3";
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  align?: "start" | "center";
}

const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
  (
    {
      className,
      as: Heading = "h2",
      eyebrow,
      title,
      description,
      actions,
      align = "start",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
      {...props}
    >
      <div className={cn("grid max-w-2xl gap-2", align === "center" && "justify-items-center")}>
        {eyebrow ? <p className="type-overline text-accent-primary">{eyebrow}</p> : null}
        <Heading className="type-heading-2 text-text-primary">{title}</Heading>
        {description ? (
          <p className="max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  ),
);
SectionHeading.displayName = "SectionHeading";

export { SectionHeading };
