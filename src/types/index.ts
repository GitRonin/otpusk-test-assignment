export type Country = {
  id: string;
  name: string;
  flag: string;
};

export type City = {
  id: number;
  name: string;
  countryId?: string;
};

export type Hotel = {
  id: number;
  name: string;
  img: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
  description?: string;
  services?: Record<string, string>;
};

export type CountriesMap = Record<string, Country>;
export type HotelsMap = Record<string, Hotel>;

export type PriceOffer = {
  id: string;
  amount: number;
  currency: "usd";
  startDate: string;
  endDate: string;
  hotelID?: string;
};

export type PricesMap = Record<string, PriceOffer>;

export type GeoEntityType = "country" | "city" | "hotel";

export type GeoEntity =
  | (Country & { type: "country" })
  | (City & { type: "city" })
  | (Hotel & { type: "hotel" });

export type GeoResponse = Record<string, GeoEntity>;

export type ErrorResponse = {
  code: number;
  error: true;
  message: string;
  waitUntil?: string;
};

export type StartSearchResponse = {
  token: string;
  waitUntil: string;
};

export type GetSearchPricesResponse = {
  prices: PricesMap;
};

export type StopSearchResponse = {
  status: "cancelled";
  message: string;
};

export type SearchStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "cancelling";

export type SelectedDestination = {
  id: string | number;
  name: string;
  type: GeoEntityType;
  countryId?: string;
};

export type TourCard = {
  id: string;
  hotelId: number;
  hotelName: string;
  hotelImage: string;
  cityName: string;
  countryName: string;
  countryFlag?: string;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
};
