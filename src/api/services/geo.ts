import type { GeoResponse } from "../../types";
import { searchGeo as apiSearchGeo } from "../api";
import { handleApiCall } from "../client";

export async function searchGeo(query?: string): Promise<GeoResponse> {
  return handleApiCall<GeoResponse>(() => apiSearchGeo(query));
}
