import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  AppButton,
  AppFormPage,
  AppFormSection,
  AppIdentitySplit,
  AppIdentitySummary,
} from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { useGetCurrentCompany } from "../api/hooks/useGetCurrentCompany";
import CompanyDeleteSection from "../components/CompanyDeleteSection";
import CompanyForm from "../components/CompanyForm";
import CompanyLogoSection from "../components/CompanyLogoSection";
import CompanyPageSkeleton from "../components/CompanyPageSkeleton";
import CompanyReadOnlyDetails from "../components/CompanyReadOnlyDetails";
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
            <p
              className={`${DesignTokens.inputs.labelFontSize} ${DesignTokens.typography.muted}`}
            >
              {t("auth.noCompany")}
            </p>
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
        <AppIdentitySplit
          sidebar={
            <>
              <AppFormSection>
                <CompanyLogoSection
                  logo={company.logo}
                  details={
                    <AppIdentitySummary
                      title={company.name}
                      subtitle={company.description || undefined}
                    />
                  }
                />
              </AppFormSection>

              <AppFormSection>
                <h2 className={DesignTokens.typography.headingSm}>
                  {t("company.details.section")}
                </h2>
                <CompanyReadOnlyDetails company={company} />
              </AppFormSection>
            </>
          }
        >
          <AppFormSection>
            <div className="flex flex-col gap-1">
              <h2 className={DesignTokens.typography.headingSm}>
                {t("company.edit.section")}
              </h2>
              <p
                className={`${DesignTokens.inputs.labelFontSize} ${DesignTokens.typography.muted}`}
              >
                {t("company.edit.description")}
              </p>
            </div>
            <CompanyForm company={company} />
          </AppFormSection>

          <AppFormSection>
            <h2 className={DesignTokens.typography.headingSm}>
              {t("company.delete.section")}
            </h2>
            <CompanyDeleteSection />
          </AppFormSection>
        </AppIdentitySplit>
      </AppFormPage>
    </div>
  );
};

export default CompanyPage;
