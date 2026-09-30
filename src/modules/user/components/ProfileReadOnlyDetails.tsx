import { useTranslation } from "react-i18next";
import { AppInfoRows } from "@/shared/ANTD_UIComponents";
import type { TUserInfo } from "../types";

type Props = {
  profile: TUserInfo;
};

const ProfileReadOnlyDetails = ({ profile }: Props) => {
  const { t } = useTranslation();

  return (
    <AppInfoRows
      rows={[
        { label: t("user.profile.idLabel"), value: profile.id },
        { label: t("user.profile.userNameLabel"), value: profile.userName },
        { label: t("user.profile.userTypeLabel"), value: profile.userTypeName },
        {
          label: t("user.profile.companyIdLabel"),
          value:
            profile.companyId === null
              ? t("user.profile.noCompany")
              : String(profile.companyId),
        },
        {
          label: t("user.profile.isManagerLabel"),
          value: profile.isManager ? t("user.profile.yes") : t("user.profile.no"),
        },
        {
          label: t("user.profile.phoneNumberLabel"),
          value: profile.phoneNumber,
        },
      ]}
    />
  );
};

export default ProfileReadOnlyDetails;
