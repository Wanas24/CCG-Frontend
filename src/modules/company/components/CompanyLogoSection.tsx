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
    <div className="flex flex-col gap-4">
      {logo ? (
        <img
          src={logo}
          alt={t("company.logo.alt")}
          className="h-28 w-28 rounded-lg object-cover border border-(--Grey300)"
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-(--Grey300) bg-(--Grey100) text-sm text-(--Grey600)">
          {t("company.logo.empty")}
        </div>
      )}

      <AppUpload
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        maxCount={1}
        showUploadList={false}
        disabled={isPending}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        label={t("company.logo.upload")}
      />

      {logo && (
        <AppButton
          variant="delete"
          loading={isDeleting}
          disabled={isUploading}
          onClick={onDelete}
        >
          {t("company.logo.delete")}
        </AppButton>
      )}
    </div>
  );
};

export default CompanyLogoSection;
