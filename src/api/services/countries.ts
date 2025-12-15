import type { CountriesMap } from "../../types";
import { getCountries as apiGetCountries } from "../api";
import { handleApiCall } from "../client";

export async function fetchCountries(): Promise<CountriesMap> {
  return handleApiCall<CountriesMap>(apiGetCountries);
}
