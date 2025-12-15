import { type InputHTMLAttributes, forwardRef } from "react";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  onClear?: () => void;
  showClear?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      className,
      onClear,
      showClear = false,
      ...props
    },
    ref
  ) => {
    const inputClasses = [
      styles.input,
      fullWidth ? styles.fullWidth : "",
      error ? styles.error : "",
      showClear ? styles.withClear : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputWrapper}>
          <input ref={ref} className={inputClasses} {...props} />
          {showClear && onClear && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={onClear}
              aria-label="Очистити"
            >
              ×
            </button>
          )}
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
