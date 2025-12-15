import { useCallback, useEffect, useState } from "react";
import { fetchPrice } from "../../../../api";
import type { PriceOffer } from "../../../../types";
import { Loader, Modal } from "../../../ui";
import styles from "./PriceDetails.module.scss";

interface PriceDetailsProps {
  priceId: string;
  hotelName: string;
  isOpen: boolean;
  onClose: () => void;
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

function PriceDetails({
  priceId,
  hotelName,
  isOpen,
  onClose,
}: PriceDetailsProps) {
  const [price, setPrice] = useState<PriceOffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPrice = useCallback(async () => {
    if (!priceId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPrice(priceId);
      setPrice(data);
    } catch (err) {
      setError("Не вдалося завантажити деталі ціни");
      console.error("Failed to fetch price:", err);
    } finally {
      setIsLoading(false);
    }
  }, [priceId]);

  useEffect(() => {
    if (isOpen && !price) {
      loadPrice();
    }
  }, [isOpen, price, loadPrice]);

  useEffect(() => {
    if (!isOpen) {
      setPrice(null);
      setError(null);
    }
  }, [isOpen]);

  const nights = price
    ? Math.ceil(
        (new Date(price.endDate).getTime() -
          new Date(price.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Деталі пропозиції">
      {isLoading && (
        <div className={styles.loading}>
          <Loader size="medium" />
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {price && !isLoading && (
        <div className={styles.details}>
          <h3 className={styles.hotelName}>{hotelName}</h3>

          <div className={styles.row}>
            <span className={styles.label}>Дата заїзду</span>
            <span className={styles.value}>{formatDate(price.startDate)}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Дата виїзду</span>
            <span className={styles.value}>{formatDate(price.endDate)}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Тривалість</span>
            <span className={styles.value}>{nights} ночей</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>Вартість</span>
            <span className={styles.priceValue}>
              {formatPrice(price.amount)}
            </span>
          </div>

          <p className={styles.note}>
            * Ціна вказана за весь тур. Додаткові послуги оплачуються окремо.
          </p>
        </div>
      )}
    </Modal>
  );
}

export default PriceDetails;
