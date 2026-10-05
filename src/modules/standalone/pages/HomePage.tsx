import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useTranslation } from "react-i18next";
import HomePermissionsPanel from "../components/HomePermissionsPanel";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 p-6">
      <header>
        <h1 className={`${DesignTokens.typography.headingSm} text-2xl!`}>
          {t("common.appName")}
        </h1>
        <p className={`m-0 mt-1 ${DesignTokens.typography.muted}`}>
          {t("home.permissions.title")}
        </p>
      </header>

      <HomePermissionsPanel />
    </div>
  );
};

export default HomePage;
