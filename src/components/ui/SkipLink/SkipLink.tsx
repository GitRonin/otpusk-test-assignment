import { type ReactNode } from "react";
import styles from "./SkipLink.module.scss";

interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a href={href} className={styles.skipLink}>
      {children}
    </a>
  );
}

export default SkipLink;
