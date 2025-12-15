import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  loading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClass} disabled={disabled || loading} {...props}>
      {loading ? "Завантаження..." : children}
    </button>
  );
};
