import type { ReactNode } from "react";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppUpload } from "@/shared/ANTD_UIComponents";
import { useProfileImageManager } from "../hooks/useProfileImageManager";

type Props = {
  profileImage: string | null;
  details?: ReactNode;
};

const ProfileImageSection = ({ profileImage, details }: Props) => {
  const { t } = useTranslation();

  const {
    beforeUpload,
    customRequest,
    onDelete,
    isUploading,
    isDeleting,
    isPending,
  } = useProfileImageManager();

  return (
    <div className="flex flex-col items-center gap-4">
      {profileImage ? (
        <img
          src={profileImage}
          alt={t("user.profile.imageAlt")}
          className={`${DesignTokens.media.avatarLg} shrink-0 rounded-full object-cover border border-(--Grey300)`}
        />
      ) : (
        <div
          className={`flex ${DesignTokens.media.avatarLg} shrink-0 flex-col items-center justify-center gap-1 rounded-full border border-(--Grey300) bg-(--Grey100) text-center ${DesignTokens.inputs.labelFontSize} ${DesignTokens.typography.muted}`}
        >
          <User size={DesignTokens.media.iconMd} />
          <span>{t("user.profile.noImage")}</span>
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
              {t("user.profile.changePhoto")}
            </AppButton>
          </AppUpload>
        </div>

        {profileImage && (
          <div className="flex justify-center">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageSection;
