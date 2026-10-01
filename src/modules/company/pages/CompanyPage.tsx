import { Link, Navigate } from "react-router";
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
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
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
  const {
    hasPermission,
    isManager,
    isLoading: isPermissionsLoading,
  } = usePermissions();
  const canGetInfo = hasPermission(PermissionsList.Company.GetCompanyInfo);
  const canEdit = hasPermission(PermissionsList.Company.Edit);
  const canUploadLogo = hasPermission(PermissionsList.Company.UploadLogo);
  const canDeleteLogo = hasPermission(PermissionsList.Company.DeleteLogo);

  const { data, isLoading, isError } = useGetCurrentCompany(canGetInfo);
  const company = data?.isSuccess ? data.data : undefined;

  if (companyId === null) {
    return (
      <div className="p-6">
        <AppFormPage title={t("company.page.title")}>
          <AppFormSection>
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <span className="text-2xl">🏢</span>
              </div>

              <h3 className="mb-2 text-base font-semibold">
                {t("auth.noCompany")}
              </h3>

              <p
                className={`${DesignTokens.typography.muted} mb-6 max-w-md`}
              >
                {t("company.page.noCompanyDescription")}
              </p>

              <Link to={COMPANY_ROUTES.create}>
                <AppButton variant="primary">
                  {t("company.create.navLabel")}
                </AppButton>
              </Link>
            </div>
          </AppFormSection>
        </AppFormPage>
      </div>
    );
  }

  if (isPermissionsLoading) {
    return <CompanyPageSkeleton />;
  }

  if (!canGetInfo) {
    return <Navigate to={APP_ROUTES.home} replace />;
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
                  canUpload={canUploadLogo}
                  canDelete={canDeleteLogo}
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
            <CompanyForm company={company} canEdit={canEdit} />
          </AppFormSection>

          {isManager ? (
            <AppFormSection>
              <h2 className={DesignTokens.typography.headingSm}>
                {t("company.delete.section")}
              </h2>
              <CompanyDeleteSection />
            </AppFormSection>
          ) : null}
        </AppIdentitySplit>
      </AppFormPage>
    </div>
  );
};

export default CompanyPage;
