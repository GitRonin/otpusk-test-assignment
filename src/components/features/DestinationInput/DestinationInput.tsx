import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type KeyboardEvent,
} from "react";
import type { GeoEntity } from "../../../types";
import { Dropdown, Input } from "../../ui";
import styles from "./DestinationInput.module.scss";
import { GeoIcon } from "./GeoIcon";
import { useDestinationSearch } from "./useDestinationSearch";

export interface DestinationInputRef {
  getCountryId: () => string | null;
  hasSelection: () => boolean;
  selectFirstItem: () => boolean;
}

interface DestinationInputProps {
  onKeyDown?: (e: KeyboardEvent) => void;
  onSelect?: (countryId: string) => void;
  onStateChange?: (state: {
    hasSelection: boolean;
    countryId: string | null;
  }) => void;
}

const DestinationInput = forwardRef<DestinationInputRef, DestinationInputProps>(
  ({ onKeyDown, onSelect, onStateChange }, ref) => {
    const {
      items,
      isLoading,
      searchText,
      setSearchText,
      selectedDestination,
      handleSelect,
      handleInputFocus,
      getCountryId,
      selectFirstItem,
      clearSearch,
    } = useDestinationSearch();

    useImperativeHandle(ref, () => ({
      getCountryId,
      hasSelection: () => selectedDestination !== null,
      selectFirstItem,
    }));

    useEffect(() => {
      onStateChange?.({
        hasSelection: selectedDestination !== null,
        countryId: getCountryId(),
      });
    }, [selectedDestination, getCountryId, onStateChange]);

    const handleItemSelect = (item: GeoEntity) => {
      handleSelect(item);
      let countryId: string | null = null;
      if (item.type === "country") {
        countryId = String(item.id);
      } else if ("countryId" in item && item.countryId) {
        countryId = item.countryId;
      }
      if (countryId && onSelect) {
        onSelect(countryId);
      }
    };

    return (
      <Dropdown.Root onSelect={(value) => handleItemSelect(value as GeoEntity)}>
        <Dropdown.Trigger>
          {({ isOpen, onFocus, onClick, onKeyDown: dropdownKeyDown }) => (
            <Input
              label="Форма пошуку турів"
              placeholder="Країна, місто або готель"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => {
                handleInputFocus();
                onFocus();
              }}
              onClick={onClick}
              onKeyDown={(e) => {
                dropdownKeyDown(e);
                onKeyDown?.(e);
              }}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              autoComplete="off"
              fullWidth
              showClear={searchText.length > 0}
              onClear={clearSearch}
            />
          )}
        </Dropdown.Trigger>
        <Dropdown.Menu
          isLoading={isLoading}
          isEmpty={!isLoading && items.length === 0}
          emptyText="Нічого не знайдено"
        >
          {!isLoading &&
            items.map((item, index) => (
              <Dropdown.Item
                key={`${item.type}-${item.id}`}
                value={item}
                index={index}
              >
                <div className={styles.itemContent}>
                  <GeoIcon
                    type={item.type}
                    flag={
                      item.type === "country"
                        ? (item as { flag: string }).flag
                        : undefined
                    }
                  />
                  <span className={styles.itemName}>{item.name}</span>
                </div>
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown.Root>
    );
  }
);

DestinationInput.displayName = "DestinationInput";

export default DestinationInput;
