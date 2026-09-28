import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton, AppUpload } from "@/shared/ANTD_UIComponents";
import { useCompanyLogoManager } from "../hooks/useCompanyLogoManager";

type Props = {
  logo: string | null;
};

const CompanyLogoSection = ({ logo }: Props) => {
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
    <div className="flex flex-col items-center gap-4 sm:flex-col sm:items-center">
      {logo ? (
        <img
          src={logo}
          alt={t("company.logo.alt")}
          className="size-28 shrink-0 rounded-full object-cover border border-(--Grey300)"
        />
      ) : (
        <div className="flex size-28 shrink-0 flex-col items-center justify-center gap-1 rounded-full border border-(--Grey300) bg-(--Grey100) text-center text-xs text-(--Grey600)">
          <Building2 size={22} />
          <span>{t("company.logo.empty")}</span>
        </div>
      )}

      <div className="flex justify-center items-center gap-2 sm:w-auto sm:flex-row">
        <AppUpload
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          maxCount={1}
          showUploadList={false}
          disabled={isPending}
          beforeUpload={beforeUpload}
          customRequest={customRequest}
        >
          <AppButton variant="primary" htmlType="button" loading={isUploading} disabled={isPending}>
            {t("company.logo.upload")}
          </AppButton>
        </AppUpload>

        {logo && (
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
        )}
      </div>
    </div>
  );
};

export default CompanyLogoSection;
