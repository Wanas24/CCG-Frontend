import { useTranslation } from "react-i18next";

/**
 * Home placeholder — business functionality is out of ST-01 scope.
 */
const HomePage = () => {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-3 px-6 py-12">
      <h2 className="text-3xl font-semibold text-(--app-text)">
        {t("home.welcome")}
      </h2>
      <p className="text-base text-(--Grey700)">{t("home.subtitle")}</p>
    </main>
  );
};

export default HomePage;
