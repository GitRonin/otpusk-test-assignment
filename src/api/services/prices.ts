import type { PriceOffer } from "../../types";
import { getPrice as apiGetPrice } from "../api";
import { handleApiCall } from "../client";

export async function fetchPrice(priceId: string): Promise<PriceOffer> {
  return handleApiCall<PriceOffer>(() => apiGetPrice(priceId));
}
