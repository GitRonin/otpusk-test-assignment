import type {
  ErrorResponse,
  GetSearchPricesResponse,
  StartSearchResponse,
  StopSearchResponse,
} from "../../types";
import {
  getSearchPrices as apiGetPrices,
  startSearchPrices as apiStartSearch,
  stopSearchPrices as apiStopSearch,
} from "../api";
import { handleApiCall, isTooEarlyError } from "../client";

const MAX_RETRIES = 2;

export async function startSearch(
  countryId: string
): Promise<StartSearchResponse> {
  return handleApiCall<StartSearchResponse>(() => apiStartSearch(countryId));
}

export async function getSearchResults(
  token: string
): Promise<GetSearchPricesResponse> {
  return handleApiCall<GetSearchPricesResponse>(() => apiGetPrices(token));
}

export async function cancelSearch(token: string): Promise<StopSearchResponse> {
  return handleApiCall<StopSearchResponse>(() => apiStopSearch(token));
}

function calculateWaitTime(waitUntil: string): number {
  const targetTime = new Date(waitUntil).getTime();
  const now = Date.now();
  return Math.max(0, targetTime - now);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type SearchController = {
  abort: () => void;
  isAborted: () => boolean;
};

export function createSearchController(): SearchController {
  let aborted = false;
  return {
    abort: () => {
      aborted = true;
    },
    isAborted: () => aborted,
  };
}

export async function executeSearch(
  countryId: string,
  controller: SearchController,
  onTokenReceived?: (token: string) => void
): Promise<GetSearchPricesResponse> {
  const { token, waitUntil } = await startSearch(countryId);

  if (controller.isAborted()) {
    throw new Error("Search cancelled");
  }

  onTokenReceived?.(token);

  const waitTime = calculateWaitTime(waitUntil);
  await delay(waitTime);

  let retryCount = 0;

  while (retryCount <= MAX_RETRIES) {
    if (controller.isAborted()) {
      throw new Error("Search cancelled");
    }

    try {
      const result = await getSearchResults(token);
      return result;
    } catch (error) {
      if (controller.isAborted()) {
        throw new Error("Search cancelled");
      }

      if (isTooEarlyError(error)) {
        const errorData = error as ErrorResponse;
        const retryWaitTime = errorData.waitUntil
          ? calculateWaitTime(errorData.waitUntil)
          : 1000;
        await delay(retryWaitTime);
        continue;
      }

      retryCount++;

      if (retryCount > MAX_RETRIES) {
        throw error;
      }

      await delay(1000);
    }
  }

  throw new Error("Search failed after maximum retries");
}
