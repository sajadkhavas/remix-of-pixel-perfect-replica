export interface AppErrorContext {
  readonly boundary?: string;
  readonly route?: string;
  readonly action?: string;
}

export function reportAppError(
  error: unknown,
  context: AppErrorContext = {},
): void {
  const normalized =
    error instanceof Error
      ? error
      : new Error(
          typeof error === "string"
            ? error
            : "Unknown application error",
        );

  console.error("[KRONOS] application error", {
    ...context,
    error: normalized,
  });
}
