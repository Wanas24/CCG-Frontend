import { useTranslation } from "react-i18next";
import styles from "./styles.module.css";

const PageLoader = () => {
  const { t } = useTranslation();
  const label = t("common.loading");

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={styles.root}
    >
      <div aria-hidden className={styles.wash} />
      <div aria-hidden className={styles.glow} />

      <div className={styles.content}>
        <p className={styles.brand}>{t("common.appName")}</p>

        <div aria-hidden className={styles.spinner}>
          <span className={styles.ringTrack} />
          <span className={styles.ringCore} />
          <span className={styles.ringOuter} />
          <span className={styles.ringInner} />
          <span className={styles.ringDot} />
        </div>

        <p className={styles.label}>
          <span>{label.replace(/\.\.\.$/, "")}</span>
          <span className={styles.dots} aria-hidden>
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
