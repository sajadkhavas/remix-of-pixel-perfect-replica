export type InterfaceDirection = "rtl" | "ltr";
export type LogicalSide = "start" | "end";
export type PhysicalSide = "left" | "right";

const FIRST_STRONG_ISOLATE = "\u2068";
const POP_DIRECTIONAL_ISOLATE = "\u2069";

export function resolveLogicalSide(
  side: LogicalSide,
  direction: InterfaceDirection,
): PhysicalSide {
  if (direction === "rtl") {
    return side === "start" ? "right" : "left";
  }

  return side === "start" ? "left" : "right";
}

export function isolateBidi(value: string | number): string {
  return `${FIRST_STRONG_ISOLATE}${value}${POP_DIRECTIONAL_ISOLATE}`;
}

export function isBidiIsolated(value: string): boolean {
  return (
    value.startsWith(FIRST_STRONG_ISOLATE) && value.endsWith(POP_DIRECTIONAL_ISOLATE)
  );
}

export function joinBidiSegments(
  segments: ReadonlyArray<string | number>,
  separator = " ",
): string {
  return segments.map(isolateBidi).join(separator);
}
