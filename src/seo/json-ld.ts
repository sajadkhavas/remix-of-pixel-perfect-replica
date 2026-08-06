export type JsonPrimitive = string | number | boolean | null;
export interface JsonObject {
  readonly [key: string]: JsonValue;
}
export interface JsonArray extends ReadonlyArray<JsonValue> {}
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export class JsonLdSerializationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "JsonLdSerializationError";
    this.code = code;
  }
}

const BLOCKED_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const MAX_DEPTH = 64;

function isPlainObject(value: object): value is Record<string, unknown> {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function sanitizeJsonValue(
  value: unknown,
  seen: WeakSet<object>,
  depth: number,
): JsonValue | undefined {
  if (depth > MAX_DEPTH) {
    throw new JsonLdSerializationError("json-depth-exceeded", "JSON-LD exceeds the depth limit.");
  }
  if (value === undefined) return undefined;
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new JsonLdSerializationError("non-finite-number", "JSON-LD cannot contain NaN or Infinity.");
    }
    return value;
  }
  if (
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  ) {
    throw new JsonLdSerializationError(
      "unsupported-json-value",
      `JSON-LD cannot contain ${typeof value} values.`,
    );
  }
  if (typeof value !== "object") {
    throw new JsonLdSerializationError("unsupported-json-value", "Unsupported JSON-LD value.");
  }
  if (seen.has(value)) {
    throw new JsonLdSerializationError("circular-json-ld", "JSON-LD cannot contain circular references.");
  }
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      const result: JsonValue[] = [];
      for (const item of value) {
        const sanitized = sanitizeJsonValue(item, seen, depth + 1);
        if (sanitized !== undefined) result.push(sanitized);
      }
      return result;
    }
    if (!isPlainObject(value)) {
      throw new JsonLdSerializationError(
        "non-plain-json-object",
        "JSON-LD accepts only plain objects and arrays.",
      );
    }
    const result: Record<string, JsonValue> = Object.create(null) as Record<string, JsonValue>;
    for (const key of Object.keys(value)) {
      if (BLOCKED_KEYS.has(key)) {
        throw new JsonLdSerializationError(
          "blocked-json-key",
          `JSON-LD key ${key} is not allowed.`,
        );
      }
      const sanitized = sanitizeJsonValue(value[key], seen, depth + 1);
      if (sanitized !== undefined) result[key] = sanitized;
    }
    return result;
  } finally {
    seen.delete(value);
  }
}

export function toSafeJsonValue(value: unknown): JsonValue {
  const result = sanitizeJsonValue(value, new WeakSet<object>(), 0);
  if (result === undefined) {
    throw new JsonLdSerializationError("undefined-root", "JSON-LD root cannot be undefined.");
  }
  return result;
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(toSafeJsonValue(value))
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
