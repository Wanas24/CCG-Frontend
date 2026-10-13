import { useTranslation } from "react-i18next";
import { AppFormPage, AppFormSection } from "@/shared/ANTD_UIComponents";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import AlertsList from "../components/AlertsList";

const AlertsPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <AppFormPage title={t("alerts.title")} className="min-w-0 gap-4!">
        <AppFormSection className="min-w-0 gap-4!">
          <p className={`m-0 ${DesignTokens.typography.muted}`}>
            {t("alerts.subtitle")}
          </p>
          <AlertsList />
        </AppFormSection>
      </AppFormPage>
    </div>
  );
};

export default AlertsPage;
