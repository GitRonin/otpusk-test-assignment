import { create } from "zustand";
import {
  cancelSearch,
  createSearchController,
  executeSearch,
  type SearchController,
} from "../api";
import type { ErrorResponse, PricesMap, SearchStatus } from "../types";

interface SearchState {
  status: SearchStatus;
  prices: PricesMap;
  activeToken: string | null;
  currentCountryId: string | null;
  error: ErrorResponse | null;
  controller: SearchController | null;
}

interface SearchActions {
  startSearch: (countryId: string) => Promise<void>;
  cancelCurrentSearch: () => Promise<void>;
  reset: () => void;
}

type SearchStore = SearchState & SearchActions;

const initialState: SearchState = {
  status: "idle",
  prices: {},
  activeToken: null,
  currentCountryId: null,
  error: null,
  controller: null,
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  ...initialState,

  startSearch: async (countryId: string) => {
    const { status, activeToken, controller: existingController } = get();

    if (status === "loading" && activeToken) {
      existingController?.abort();

      set({ status: "cancelling" });

      try {
        await cancelSearch(activeToken);
      } catch {
        // Ignore cancel errors
      }
    }

    const controller = createSearchController();

    set({
      status: "loading",
      prices: {},
      error: null,
      currentCountryId: countryId,
      controller,
    });

    try {
      const result = await executeSearch(countryId, controller, (token) =>
        set({ activeToken: token })
      );

      if (controller.isAborted()) {
        return;
      }

      set({
        status: "success",
        prices: result.prices,
        error: null,
        controller: null,
      });
    } catch (error) {
      if (controller.isAborted()) {
        return;
      }

      const errorResponse = error as ErrorResponse;

      set({
        status: "error",
        error: errorResponse,
        controller: null,
      });
    }
  },

  cancelCurrentSearch: async () => {
    const { activeToken, controller } = get();

    controller?.abort();

    if (activeToken) {
      try {
        await cancelSearch(activeToken);
      } catch {
        // Ignore cancel errors
      }
    }

    set({
      ...initialState,
    });
  },

  reset: () => {
    const { controller } = get();
    controller?.abort();
    set(initialState);
  },
}));

export const selectIsSearching = (state: SearchStore) =>
  state.status === "loading" || state.status === "cancelling";

export const selectHasResults = (state: SearchStore) =>
  state.status === "success" && Object.keys(state.prices).length > 0;

export const selectIsEmpty = (state: SearchStore) =>
  state.status === "success" && Object.keys(state.prices).length === 0;
