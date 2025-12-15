import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCountries, searchGeo } from "../../../api";
import type {
  CountriesMap,
  GeoEntity,
  GeoResponse,
  SelectedDestination,
} from "../../../types";

const DEBOUNCE_DELAY = 300;

interface UseDestinationSearchResult {
  items: GeoEntity[];
  isLoading: boolean;
  searchText: string;
  setSearchText: (text: string) => void;
  selectedDestination: SelectedDestination | null;
  handleSelect: (item: GeoEntity) => void;
  handleInputFocus: () => void;
  getCountryId: () => string | null;
  selectFirstItem: () => boolean;
  clearSearch: () => void;
}

export function useDestinationSearch(): UseDestinationSearchResult {
  const [countries, setCountries] = useState<CountriesMap>({});
  const [geoResults, setGeoResults] = useState<GeoResponse>({});
  const [searchText, setSearchText] = useState("");
  const [selectedDestination, setSelectedDestination] =
    useState<SelectedDestination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCountries, setShowCountries] = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    async function loadCountries() {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    }
    loadCountries();
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (selectedDestination && searchText !== selectedDestination.name) {
      setSelectedDestination(null);
    }

    if (!searchText.trim()) {
      setShowCountries(true);
      setGeoResults({});
      return;
    }

    setShowCountries(false);
    setIsLoading(true);
    setGeoResults({});

    const requestId = ++requestIdRef.current;
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchGeo(searchText);
        if (requestId === requestIdRef.current) {
          setGeoResults(data);
        }
      } catch (error) {
        if (requestId === requestIdRef.current) {
          console.error("Geo search failed:", error);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchText, selectedDestination]);

  const handleSelect = useCallback((item: GeoEntity) => {
    const destination: SelectedDestination = {
      id: item.id,
      name: item.name,
      type: item.type,
    };

    if (item.type !== "country" && "countryId" in item) {
      destination.countryId = item.countryId;
    }

    setSelectedDestination(destination);
    setSearchText(item.name);
    setShowCountries(item.type === "country");
  }, []);

  const handleInputFocus = useCallback(() => {
    if (!selectedDestination) {
      setShowCountries(true);
      return;
    }

    if (selectedDestination.type === "country") {
      setShowCountries(true);
      return;
    }

    setShowCountries(false);
    if (!searchText) return;

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    searchGeo(searchText)
      .then((data) => {
        if (requestId === requestIdRef.current) setGeoResults(data);
      })
      .catch((error) => {
        if (requestId === requestIdRef.current) {
          console.error("Geo search failed:", error);
        }
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false);
      });
  }, [selectedDestination, searchText]);

  const getCountryId = useCallback((): string | null => {
    if (!selectedDestination) return null;

    if (selectedDestination.type === "country") {
      return String(selectedDestination.id);
    }

    return selectedDestination.countryId || null;
  }, [selectedDestination]);

  const items: GeoEntity[] = showCountries
    ? Object.values(countries).map((c) => ({ ...c, type: "country" as const }))
    : Object.values(geoResults);

  const selectFirstItem = useCallback((): boolean => {
    if (items.length > 0 && items[0]) {
      handleSelect(items[0]);
      return true;
    }
    return false;
  }, [items, handleSelect]);

  const clearSearch = useCallback(() => {
    setSearchText("");
    setSelectedDestination(null);
    setShowCountries(true);
    setGeoResults({});
  }, []);

  return {
    items,
    isLoading: isLoading && !showCountries,
    searchText,
    setSearchText,
    selectedDestination,
    handleSelect,
    handleInputFocus,
    getCountryId,
    selectFirstItem,
    clearSearch,
  };
}
