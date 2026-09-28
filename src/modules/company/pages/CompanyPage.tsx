import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  AppButton,
  AppFormPage,
  AppFormSection,
} from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { useGetCurrentCompany } from "../api/hooks/useGetCurrentCompany";
import CompanyDeleteSection from "../components/CompanyDeleteSection";
import CompanyForm from "../components/CompanyForm";
import CompanyLogoSection from "../components/CompanyLogoSection";
import CompanyPageSkeleton from "../components/CompanyPageSkeleton";
import { COMPANY_ROUTES } from "../routes/paths";

const CompanyPage = () => {
  const { t } = useTranslation();
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const { data, isLoading, isError } = useGetCurrentCompany();
  const company = data?.isSuccess ? data.data : undefined;

  if (companyId === null) {
    return (
      <div className="p-6">
        <AppFormPage title={t("company.page.title")}>
          <AppFormSection>
            <p className="text-sm text-(--Grey600)">{t("auth.noCompany")}</p>
            <Link to={COMPANY_ROUTES.create}>
              <AppButton variant="primary">{t("company.create.navLabel")}</AppButton>
            </Link>
          </AppFormSection>
        </AppFormPage>
      </div>
    );
  }

  if (isLoading) {
    return <CompanyPageSkeleton />;
  }

  if (isError || !company) {
    return (
      <div className="p-6">
        <AppErrorContainer error={data?.message ?? t("company.page.loadError")} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <AppFormPage title={t("company.page.title")}>
        <div className="flex flex-col gap-6">
          <AppFormSection>
            <h2 className="text-base font-semibold text-(--app-text)">
              {t("company.logo.section")}
            </h2>
            <CompanyLogoSection logo={company.logo} />
          </AppFormSection>

          <AppFormSection>
            <h2 className="text-base font-semibold text-(--app-text)">
              {t("company.edit.section")}
            </h2>
            <CompanyForm company={company} />
          </AppFormSection>

          <AppFormSection>
            <h2 className="text-base font-semibold text-(--app-text)">
              {t("company.delete.section")}
            </h2>
            <CompanyDeleteSection />
          </AppFormSection>
        </div>
      </AppFormPage>
    </div>
  );
};

export default CompanyPage;
