import { useEffect, useMemo, useState } from "react";
import { useHotelsStore, useSearchStore } from "../../../store";
import type { PricesMap, TourCard } from "../../../types";

interface HotelWithFlag {
  id: number;
  name: string;
  img: string;
  cityName: string;
  countryName: string;
  countryFlag?: string;
}

function transformToTourCards(
  prices: PricesMap,
  hotels: Record<string, HotelWithFlag>
): TourCard[] {
  const cards: TourCard[] = [];

  for (const price of Object.values(prices)) {
    if (!price.hotelID) continue;

    const hotel = hotels[price.hotelID];
    if (!hotel) continue;

    cards.push({
      id: price.id,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.img,
      cityName: hotel.cityName,
      countryName: hotel.countryName,
      countryFlag: hotel.countryFlag,
      price: price.amount,
      currency: price.currency,
      startDate: price.startDate,
      endDate: price.endDate,
    });
  }

  return cards.sort((a, b) => a.price - b.price);
}

export function useTourCards() {
  const prices = useSearchStore((state) => state.prices);
  const currentCountryId = useSearchStore((state) => state.currentCountryId);
  const searchStatus = useSearchStore((state) => state.status);

  const hotelsByCountry = useHotelsStore((state) => state.hotelsByCountry);
  const fetchHotels = useHotelsStore((state) => state.fetchHotels);
  const loadingCountries = useHotelsStore((state) => state.loadingCountries);

  const [isLoadingHotels, setIsLoadingHotels] = useState(false);

  useEffect(() => {
    if (
      searchStatus === "success" &&
      currentCountryId &&
      !hotelsByCountry[currentCountryId]
    ) {
      const loadHotels = async () => {
        setIsLoadingHotels(true);
        try {
          await fetchHotels(currentCountryId);
        } finally {
          setIsLoadingHotels(false);
        }
      };

      loadHotels();
    }
  }, [searchStatus, currentCountryId, hotelsByCountry, fetchHotels]);

  const tourCards = useMemo(() => {
    if (!currentCountryId) return [];

    const hotels = hotelsByCountry[currentCountryId] || {};
    return transformToTourCards(prices, hotels);
  }, [prices, hotelsByCountry, currentCountryId]);

  const isLoading =
    isLoadingHotels ||
    (currentCountryId ? loadingCountries.has(currentCountryId) : false);

  return {
    tourCards,
    isLoading,
    isEmpty: searchStatus === "success" && tourCards.length === 0 && !isLoading,
  };
}
