import type { ReactNode } from "react";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppUpload } from "@/shared/ANTD_UIComponents";
import { useCompanyLogoManager } from "../hooks/useCompanyLogoManager";

type Props = {
  logo: string | null;
  details?: ReactNode;
};

const CompanyLogoSection = ({ logo, details }: Props) => {
  const { t } = useTranslation();
  const {
    beforeUpload,
    customRequest,
    onDelete,
    isUploading,
    isDeleting,
    isPending,
  } = useCompanyLogoManager();

  return (
    <div className="flex flex-col items-center gap-4">
      {logo ? (
        <img
          src={logo}
          alt={t("company.logo.alt")}
          className={`${DesignTokens.media.avatarLg} shrink-0 rounded-full object-cover border border-(--Grey300)`}
        />
      ) : (
        <div
          className={`flex ${DesignTokens.media.avatarLg} shrink-0 flex-col items-center justify-center gap-1 rounded-full border border-(--Grey300) bg-(--Grey100) text-center ${DesignTokens.inputs.labelFontSize} ${DesignTokens.typography.muted}`}
        >
          <Building2 size={DesignTokens.media.iconMd} />
          <span>{t("company.logo.empty")}</span>
        </div>
      )}

      {details}

      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <div className="flex justify-center">
          <AppUpload
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            maxCount={1}
            showUploadList={false}
            disabled={isPending}
            beforeUpload={beforeUpload}
            customRequest={customRequest}
          >
            <AppButton
              variant="primary"
              htmlType="button"
              loading={isUploading}
              disabled={isPending}
            >
              {t("company.logo.change")}
            </AppButton>
          </AppUpload>
        </div>

        {logo && (
          <div className="flex justify-center">
            <AppButton
              variant="delete"
              htmlType="button"
              loading={isDeleting}
              disabled={isUploading}
              onClick={onDelete}
              aria-label={t("company.logo.delete")}
            >
              {t("company.logo.delete")}
            </AppButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyLogoSection;
