import { useState } from "react";
import type { TourCard as TourCardType } from "../../../../types";
import PriceDetails from "./PriceDetails";
import styles from "./TourCard.module.scss";

interface TourCardProps {
  tour: TourCardType;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("uk-UA").format(amount) + " грн";
}

function TourCard({ tour }: TourCardProps) {
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const handleOpenPrice = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPriceModalOpen(true);
  };

  return (
    <>
      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          <img
            src={tour.hotelImage}
            alt={tour.hotelName}
            className={styles.image}
            loading="lazy"
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.hotelName}>{tour.hotelName}</h3>
          <p className={styles.location}>
            {tour.countryFlag && (
              <img
                src={tour.countryFlag}
                alt={tour.countryName}
                className={styles.flag}
              />
            )}
            {tour.countryName}, {tour.cityName}
          </p>
          <p className={styles.datesLabel}>Старт туру</p>
          <p className={styles.datesValue}>{formatDate(tour.startDate)}</p>
          <p className={styles.price}>{formatPrice(tour.price)}</p>
          <button
            type="button"
            className={styles.priceLink}
            onClick={handleOpenPrice}
          >
            Відкрити ціну
          </button>
        </div>
      </article>

      <PriceDetails
        priceId={tour.id}
        hotelName={tour.hotelName}
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
      />
    </>
  );
}

export default TourCard;
