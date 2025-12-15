import type { GeoEntityType } from "../../../types";
import styles from "./GeoIcon.module.scss";

interface GeoIconProps {
  type: GeoEntityType;
  flag?: string;
}

export function GeoIcon({ type, flag }: GeoIconProps) {
  if (type === "country" && flag) {
    return <img src={flag} alt="Country flag" className={styles.flag} />;
  }

  return (
    <div className={`${styles.icon} ${styles[type]}`}>
      {type === "country" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 5v14l5-3 4 3 5-3V2l-5 3-4-3-5 3z" fill="#6b7280" />
        </svg>
      )}
      {type === "city" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="10" r="3" fill="#6b7280" />
          <path
            d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"
            fill="#6b7280"
          />
        </svg>
      )}
      {type === "hotel" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"
            fill="#6b7280"
          />
        </svg>
      )}
    </div>
  );
}
