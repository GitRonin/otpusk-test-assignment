import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "../../ui";
import { DestinationInput } from "../DestinationInput";
import styles from "./SearchForm.module.scss";

interface SearchFormProps {
  onSearch: (countryId: string) => void;
  onCancel?: () => void;
  isSearching?: boolean;
  currentSearchCountryId?: string | null;
}

function SearchForm({
  onSearch,
  onCancel,
  isSearching = false,
  currentSearchCountryId,
}: SearchFormProps) {
  const [destinationState, setDestinationState] = useState<{
    hasSelection: boolean;
    countryId: string | null;
  }>({ hasSelection: false, countryId: null });

  const selectionChanged = useMemo(() => {
    if (!isSearching) return false;
    if (!destinationState.hasSelection) return false;
    if (!currentSearchCountryId) return true;
    return destinationState.countryId !== currentSearchCountryId;
  }, [destinationState, isSearching, currentSearchCountryId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const countryId = destinationState.countryId;
    if (countryId) {
      onSearch(countryId);
    }
  };

  const enterPressedRef = useRef(false);

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      enterPressedRef.current = true;
    }
  };

  const handleDestinationSelect = (countryId: string) => {
    if (enterPressedRef.current) {
      enterPressedRef.current = false;
      onSearch(countryId);
    }
  };

  const isButtonDisabled = !destinationState.hasSelection;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <DestinationInput
          onKeyDown={handleInputKeyDown}
          onSelect={handleDestinationSelect}
          onStateChange={setDestinationState}
        />
      </div>
      <div className={styles.buttonGroup}>
        <Button
          type="submit"
          disabled={isButtonDisabled}
          isLoading={isSearching && !selectionChanged}
          size="lg"
        >
          Знайти
        </Button>
        {isSearching && onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            size="lg"
          >
            Скасувати
          </Button>
        )}
      </div>
    </form>
  );
}

export default SearchForm;
