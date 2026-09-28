import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton, AppUpload } from "@/shared/ANTD_UIComponents";
import { useProfileImageManager } from "../hooks/useProfileImageManager";

type Props = {
  profileImage: string | null;
  companyId: number | null;
};

const ProfileImageSection = ({ profileImage, companyId }: Props) => {
  const { t } = useTranslation();
  const hasCompany = companyId !== null;
  const {
    beforeUpload,
    customRequest,
    onDelete,
    isUploading,
    isDeleting,
    isPending,
  } = useProfileImageManager(hasCompany);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-col sm:items-center">
      {profileImage ? (
        <img
          src={profileImage}
          alt={t("user.profile.imageAlt")}
          className="size-28 shrink-0 rounded-full object-cover border border-(--Grey300)"
        />
      ) : (
        <div className="flex size-28 shrink-0 flex-col items-center justify-center gap-1 rounded-full border border-(--Grey300) bg-(--Grey100) text-center text-xs text-(--Grey600)">
          <User size={22} />
          <span>{t("user.profile.noImage")}</span>
        </div>
      )}

      <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:items-start">
        {!hasCompany && (
          <p className="text-sm text-(--Grey600)">
            {t("user.profile.imageRequiresCompany")}
          </p>
        )}

        <div className="flex justify-center items-center gap-2 sm:w-auto sm:flex-row ">
          <AppUpload
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            maxCount={1}
            showUploadList={false}
            disabled={!hasCompany || isPending}
            beforeUpload={beforeUpload}
            customRequest={customRequest}
          >
            <AppButton
              variant="primary"
              htmlType="button"
              loading={isUploading}
              disabled={!hasCompany || isPending}
            >
              {t("user.profile.uploadImage")}
            </AppButton>
          </AppUpload>

          {profileImage && (
            <AppButton
              variant="delete"
              htmlType="button"
              loading={isDeleting}
              disabled={isUploading}
              onClick={onDelete}
              aria-label={t("user.profile.deleteImage")}
            >
              {t("user.profile.deleteImage")}
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageSection;
