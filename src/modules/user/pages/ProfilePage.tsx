import { useTranslation } from "react-i18next";
import {
  AppFormPage,
  AppFormSection,
} from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useGetMe } from "../api/hooks/useGetMe";
import ChangePhoneForm from "../components/ChangePhoneForm";
import ProfileForm from "../components/ProfileForm";
import ProfileImageSection from "../components/ProfileImageSection";
import ProfilePageSkeleton from "../components/ProfilePageSkeleton";
import ProfileReadOnlyDetails from "../components/ProfileReadOnlyDetails";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetMe();
  const profile = data?.isSuccess ? data.data : undefined;

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="p-6">
        <AppErrorContainer error={data?.message ?? t("user.profile.loadError")} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <AppFormPage title={t("user.profile.title")}>
        <div className="flex flex-col gap-6">
          <AppFormSection>
            <h2 className="text-base font-semibold text-(--app-text)">
              {t("user.profile.imageSection")}
            </h2>
            <ProfileImageSection
              profileImage={profile.profileImage}
              companyId={profile.companyId}
            />
          </AppFormSection>

          <AppFormSection>
            <h2 className="text-base font-semibold text-(--app-text)">
              {t("user.profile.accountSection")}
            </h2>
            <ProfileReadOnlyDetails profile={profile} />
          </AppFormSection>

          <AppFormSection>
            <h2 className="text-base font-semibold text-(--app-text)">
              {t("user.profile.personalSection")}
            </h2>
            <ProfileForm profile={profile} />
          </AppFormSection>

          <AppFormSection>
            <h2 className="text-base font-semibold text-(--app-text)">
              {t("user.profile.phoneSection")}
            </h2>
            <p className="text-sm text-(--Grey600)">
              {t("user.profile.phoneHint")}
            </p>
            <ChangePhoneForm currentPhoneNumber={profile.phoneNumber} />
          </AppFormSection>
        </div>
      </AppFormPage>
    </div>
  );
};

export default ProfilePage;
