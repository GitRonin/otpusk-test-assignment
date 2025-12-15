import { create } from "zustand";
import { fetchHotelsByCountry } from "../api";
import type { HotelsMap } from "../types";

const inFlight = new Map<string, Promise<HotelsMap>>();

interface HotelsState {
  hotelsByCountry: Record<string, HotelsMap>;
  loadingCountries: Set<string>;
  errors: Record<string, string>;
}

interface HotelsActions {
  fetchHotels: (countryId: string) => Promise<HotelsMap>;
  getHotel: (
    hotelId: string | number
  ) => HotelsState["hotelsByCountry"][string][string] | null;
  clearCache: () => void;
}

type HotelsStore = HotelsState & HotelsActions;

const initialState: HotelsState = {
  hotelsByCountry: {},
  loadingCountries: new Set(),
  errors: {},
};

export const useHotelsStore = create<HotelsStore>((set, get) => ({
  ...initialState,

  fetchHotels: async (countryId: string) => {
    const { hotelsByCountry } = get();

    if (hotelsByCountry[countryId]) {
      return hotelsByCountry[countryId];
    }

    const existing = inFlight.get(countryId);
    if (existing) return existing;

    set((state) => ({
      loadingCountries: new Set([...state.loadingCountries, countryId]),
    }));

    const promise = (async () => {
      try {
        const hotels = await fetchHotelsByCountry(countryId);

        set((state) => {
          const nextLoading = new Set(state.loadingCountries);
          nextLoading.delete(countryId);

          return {
            hotelsByCountry: {
              ...state.hotelsByCountry,
              [countryId]: hotels,
            },
            loadingCountries: nextLoading,
          };
        });

        return hotels;
      } catch (error) {
        set((state) => {
          const nextLoading = new Set(state.loadingCountries);
          nextLoading.delete(countryId);

          return {
            loadingCountries: nextLoading,
            errors: {
              ...state.errors,
              [countryId]:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch hotels",
            },
          };
        });

        return {};
      } finally {
        inFlight.delete(countryId);
      }
    })();

    inFlight.set(countryId, promise);
    return promise;
  },

  getHotel: (hotelId: string | number) => {
    const { hotelsByCountry } = get();
    const id = String(hotelId);

    for (const hotels of Object.values(hotelsByCountry)) {
      if (hotels[id]) {
        return hotels[id];
      }
    }

    return null;
  },

  clearCache: () => {
    set(initialState);
  },
}));
