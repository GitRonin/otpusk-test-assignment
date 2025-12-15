import { useCallback } from "react";
import styles from "./App.module.scss";
import { SearchForm } from "./components/features";
import { SkipLink } from "./components/ui/SkipLink";
import { selectIsSearching, useSearchStore } from "./store";

function App() {
  const startSearch = useSearchStore((state) => state.startSearch);
  const cancelCurrentSearch = useSearchStore(
    (state) => state.cancelCurrentSearch
  );
  const isSearching = useSearchStore(selectIsSearching);
  const currentCountryId = useSearchStore((state) => state.currentCountryId);

  const handleSearch = useCallback(
    (countryId: string) => {
      startSearch(countryId);
    },
    [startSearch]
  );

  const handleCancel = useCallback(() => {
    cancelCurrentSearch();
  }, [cancelCurrentSearch]);

  return (
    <div className={styles.app}>
      <SkipLink href="#main-content">Перейти до основного вмісту</SkipLink>
      <header className={styles.header}>
        <h1 className={styles.title}>Пошук турів</h1>
      </header>
      <main id="main-content" className={styles.main}>
        <SearchForm
          onSearch={handleSearch}
          onCancel={handleCancel}
          isSearching={isSearching}
          currentSearchCountryId={currentCountryId}
        />
      </main>
    </div>
  );
}

export default App;
