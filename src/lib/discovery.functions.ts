import { createServerFn } from "@tanstack/react-start";

import type { DiscoverySearchState } from "@/domain/search";
import { loadDiscoveryServer } from "@/lib/discovery.server";

export interface DiscoveryRequest {
  readonly state: DiscoverySearchState;
  readonly categorySlug?: string;
}

export const getDiscoveryData = createServerFn({ method: "GET" })
  .validator((data: DiscoveryRequest) => data)
  .handler(({ data }) => loadDiscoveryServer(data));
