import { createIsomorphicFn } from "@tanstack/react-start";

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

export function encodeDiscoveryRequest(input: DiscoveryRequest): DiscoveryWireRequest {
  return {
    search: serializeDiscoverySearch(input.state, DEFAULT_DISCOVERY_SORT),
    categorySlug: input.categorySlug,
  };
}

export function decodeDiscoveryRequest(input: unknown): DiscoveryRequest | null {
  if (!input || typeof input !== "object") return null;
  const record = input as Record<string, unknown>;
  if (typeof record.search !== "string" || record.search.length > 4096) return null;
  if (
    record.categorySlug !== undefined &&
    (typeof record.categorySlug !== "string" || !/^[a-z0-9-]{1,80}$/.test(record.categorySlug))
  ) {
    return null;
  }

  const search = validatePublicDiscoverySearch(new URLSearchParams(record.search));
  return {
    state: completeDiscoveryState(search),
    categorySlug: typeof record.categorySlug === "string" ? record.categorySlug : undefined,
  };
}

export const getDiscoveryData = createIsomorphicFn()
  .server(async (input: DiscoveryRequest): Promise<DiscoveryServerResult> => {
    const { loadDiscoveryServer } = await import("@/lib/discovery.server");
    return loadDiscoveryServer(input);
  })
  .client(async (input: DiscoveryRequest): Promise<DiscoveryServerResult> => {
    const response = await fetch("/shop", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(encodeDiscoveryRequest(input)),
    });
    if (!response.ok) throw new Error(`Discovery request failed with ${response.status}`);
    return (await response.json()) as DiscoveryServerResult;
  });
