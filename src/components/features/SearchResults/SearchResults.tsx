import { selectIsSearching, useSearchStore } from "../../../store";
import { Loader } from "../../ui";
import styles from "./SearchResults.module.scss";
import { TourCard } from "./TourCard";
import { useTourCards } from "./useTourCards";

function SearchResults() {
  const status = useSearchStore((state) => state.status);
  const error = useSearchStore((state) => state.error);
  const isSearching = useSearchStore(selectIsSearching);

  const { tourCards, isLoading, isEmpty } = useTourCards();

  if (status === "idle") {
    return null;
  }

  if (isSearching || isLoading) {
    return (
      <div className={styles.stateContainer}>
        <Loader size="large" text="Шукаємо тури..." />
      </div>
    );
  }

  if (status === "error" && error) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <h3 className={styles.errorTitle}>Помилка пошуку</h3>
          <p className={styles.errorMessage}>{error.message}</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔍</span>
          <h3 className={styles.emptyTitle}>Турів не знайдено</h3>
          <p className={styles.emptyMessage}>
            За вашим запитом турів не знайдено. Спробуйте змінити параметри
            пошуку.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.results}>
      <h2 className={styles.title}>Знайдено турів: {tourCards.length}</h2>
      <div className={styles.grid}>
        {tourCards.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
}

export default SearchResults;
