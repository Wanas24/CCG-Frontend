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
    <div className="flex flex-col gap-4">
      {profileImage ? (
        <img
          src={profileImage}
          alt={t("user.profile.imageAlt")}
          className="h-28 w-28 rounded-full object-cover border border-(--Grey300)"
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-(--Grey300) bg-(--Grey100) text-sm text-(--Grey600)">
          {t("user.profile.noImage")}
        </div>
      )}

      {!hasCompany && (
        <p className="text-sm text-(--Grey600)">
          {t("user.profile.imageRequiresCompany")}
        </p>
      )}

      <AppUpload
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        maxCount={1}
        showUploadList={false}
        disabled={!hasCompany || isPending}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        label={t("user.profile.uploadImage")}
      />

      {profileImage && (
        <AppButton
          variant="delete"
          loading={isDeleting}
          disabled={isUploading}
          onClick={onDelete}
        >
          {t("user.profile.deleteImage")}
        </AppButton>
      )}
    </div>
  );
};

export default ProfileImageSection;
