import { createServerFn } from "@tanstack/react-start";

import {
  serializeDiscoverySearch,
  type DiscoverySearchState,
} from "@/domain/search";
import {
  completeDiscoveryState,
  DEFAULT_DISCOVERY_SORT,
  validatePublicDiscoverySearch,
  type DiscoveryServerResult,
} from "@/lib/discovery";

export interface DiscoveryRequest {
  readonly state: DiscoverySearchState;
  readonly categorySlug?: string;
}

export interface DiscoveryWireRequest {
  readonly search: string;
  readonly categorySlug?: string;
}

export function encodeDiscoveryRequest(
  input: DiscoveryRequest,
): DiscoveryWireRequest {
  return {
    search: serializeDiscoverySearch(
      input.state,
      DEFAULT_DISCOVERY_SORT,
    ),
    categorySlug: input.categorySlug,
  };
}

function parseWireSearch(
  search: string,
): Record<string, string | string[]> {
  const raw: Record<string, string | string[]> = {};

  for (const [key, value] of new URLSearchParams(search)) {
    const current = raw[key];

    if (current === undefined) {
      raw[key] = value;
    } else if (Array.isArray(current)) {
      current.push(value);
    } else {
      raw[key] = [current, value];
    }
  }

  return raw;
}

export function decodeDiscoveryRequest(
  input: unknown,
): DiscoveryRequest | null {
  if (!input || typeof input !== "object") return null;

  const record = input as Record<string, unknown>;

  if (
    typeof record.search !== "string" ||
    record.search.length > 4096
  ) {
    return null;
  }

  if (
    record.categorySlug !== undefined &&
    (typeof record.categorySlug !== "string" ||
      !/^[a-z0-9-]{1,80}$/.test(record.categorySlug))
  ) {
    return null;
  }

  const search = validatePublicDiscoverySearch(
    parseWireSearch(record.search),
  );

  return {
    state: completeDiscoveryState(search),
    categorySlug:
      typeof record.categorySlug === "string"
        ? record.categorySlug
        : undefined,
  };
}

const loadDiscovery = createServerFn({ method: "POST" })
  .inputValidator((wire: DiscoveryWireRequest) => {
    const decoded = decodeDiscoveryRequest(wire);

    if (!decoded) {
      throw new Error("درخواست فروشگاه معتبر نیست.");
    }

    return decoded;
  })
  .handler(async ({ data }) => {
    const { loadDiscoveryServer } = await import(
      "@/lib/discovery.server"
    );

    return loadDiscoveryServer(data);
  });

export async function getDiscoveryData(
  input: DiscoveryRequest,
): Promise<DiscoveryServerResult> {
  return loadDiscovery({
    data: encodeDiscoveryRequest(input),
  });
}
