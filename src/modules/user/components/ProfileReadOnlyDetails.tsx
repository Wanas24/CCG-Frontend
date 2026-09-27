import { useTranslation } from "react-i18next";
import { AppInput } from "@/shared/ANTD_UIComponents";
import type { TUserInfo } from "../types";

type Props = {
  profile: TUserInfo;
};

const ProfileReadOnlyDetails = ({ profile }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <AppInput
        value={profile.id}
        label={t("user.profile.idLabel")}
        readOnly
        disabled
      />
      <AppInput
        value={profile.email}
        label={t("user.profile.emailLabel")}
        readOnly
        disabled
      />
      <AppInput
        value={profile.userName}
        label={t("user.profile.userNameLabel")}
        readOnly
        disabled
      />
      <AppInput
        value={profile.userTypeName}
        label={t("user.profile.userTypeLabel")}
        readOnly
        disabled
      />
      <AppInput
        value={
          profile.companyId === null
            ? t("user.profile.noCompany")
            : String(profile.companyId)
        }
        label={t("user.profile.companyIdLabel")}
        readOnly
        disabled
      />
      <AppInput
        value={
          profile.isManager ? t("user.profile.yes") : t("user.profile.no")
        }
        label={t("user.profile.isManagerLabel")}
        readOnly
        disabled
      />
      <AppInput
        value={profile.isActive ? t("user.profile.yes") : t("user.profile.no")}
        label={t("user.profile.isActiveLabel")}
        readOnly
        disabled
      />
    </div>
  );
};

export default ProfileReadOnlyDetails;
