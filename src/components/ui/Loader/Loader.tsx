import styles from "./Loader.module.scss";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

export const Loader = ({ size = "medium", text }: LoaderProps) => {
  const loaderClass = [styles.loader, styles[size]].join(" ");

  return (
    <div className={styles.container}>
      <div className={loaderClass} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};
