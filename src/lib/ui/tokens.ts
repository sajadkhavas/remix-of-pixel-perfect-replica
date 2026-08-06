export const semanticColorTokens = [
  "background-canvas",
  "background-surface",
  "background-elevated",
  "background-inverse",
  "background-overlay",
  "text-primary",
  "text-secondary",
  "text-muted",
  "text-inverse",
  "text-disabled",
  "border-subtle",
  "border-default",
  "border-strong",
  "accent-primary",
  "accent-hover",
  "accent-active",
  "accent-muted",
  "status-success",
  "status-warning",
  "status-error",
  "status-info",
  "focus-ring",
  "selection",
  "skeleton-base",
  "skeleton-highlight",
  "product-sale",
  "product-new",
  "product-limited",
  "product-out-of-stock",
] as const;

export const typographyTokens = [
  "type-display-size",
  "type-heading-1-size",
  "type-heading-2-size",
  "type-heading-3-size",
  "type-body-large-size",
  "type-body-size",
  "type-label-size",
  "type-caption-size",
  "type-overline-size",
] as const;

export const motionTokens = [
  "duration-instant",
  "duration-fast",
  "duration-normal",
  "duration-slow",
  "ease-standard",
  "ease-enter",
  "ease-exit",
  "motion-distance-small",
  "motion-distance-medium",
  "motion-scale-pressed",
] as const;

export const layoutTokens = [
  "section-space-commerce",
  "section-space-editorial",
  "container-compact",
  "container-content",
  "container-commerce",
  "container-wide",
  "content-measure",
  "gutter-page",
  "grid-gap",
  "control-height-small",
  "control-height-default",
  "control-height-large",
  "touch-target-min",
  "sticky-offset-header",
  "sticky-offset-mobile-header",
] as const;

export type SemanticColorToken = (typeof semanticColorTokens)[number];
export type TypographyToken = (typeof typographyTokens)[number];
export type MotionToken = (typeof motionTokens)[number];
export type LayoutToken = (typeof layoutTokens)[number];
export type DesignToken = SemanticColorToken | TypographyToken | MotionToken | LayoutToken;

export const designTokenGroups = {
  color: semanticColorTokens,
  typography: typographyTokens,
  motion: motionTokens,
  layout: layoutTokens,
} as const;

export function cssVariableForToken(token: DesignToken): `--${DesignToken}` {
  return `--${token}`;
}
