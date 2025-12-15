import type { Hotel, HotelsMap } from "../../types";
import { getHotel as apiGetHotel, getHotels as apiGetHotels } from "../api";
import { handleApiCall } from "../client";

export async function fetchHotelsByCountry(
  countryId: string
): Promise<HotelsMap> {
  return handleApiCall<HotelsMap>(() => apiGetHotels(countryId));
}

export async function fetchHotel(hotelId: number | string): Promise<Hotel> {
  return handleApiCall<Hotel>(() => apiGetHotel(hotelId));
}
