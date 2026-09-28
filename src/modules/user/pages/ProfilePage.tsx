import { useTranslation } from "react-i18next";
import {
  AppDivider,
  AppFormPage,
  AppFormSection,
  AppIdentitySplit,
  AppIdentitySummary,
  AppTag,
} from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
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

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div className="p-6">
      <AppFormPage title={t("user.profile.title")}>
        <AppIdentitySplit
          sidebar={
            <>
              <AppFormSection>
                <ProfileImageSection
                  profileImage={profile.profileImage}
                  details={
                    <AppIdentitySummary
                      title={fullName}
                      subtitle={profile.email}
                      status={
                        <AppTag
                          variant={profile.isActive ? "active" : "draft"}
                          className="mt-1"
                        >
                          {profile.isActive
                            ? t("user.profile.activeStatus")
                            : t("user.profile.inactiveStatus")}
                        </AppTag>
                      }
                    />
                  }
                />
              </AppFormSection>

              <AppFormSection>
                <h2 className={DesignTokens.typography.headingSm}>
                  {t("user.profile.accountSection")}
                </h2>
                <ProfileReadOnlyDetails profile={profile} />
              </AppFormSection>
            </>
          }
        >
          <AppFormSection>
            <div className="flex flex-col gap-1">
              <h2 className={DesignTokens.typography.headingSm}>
                {t("user.profile.personalSection")}
              </h2>
              <p
                className={`${DesignTokens.inputs.labelFontSize} ${DesignTokens.typography.muted}`}
              >
                {t("user.profile.formDescription")}
              </p>
            </div>
            <ProfileForm profile={profile} />
          </AppFormSection>

          <AppFormSection>
            <div className="flex flex-col gap-1">
              <h2 className={DesignTokens.typography.headingSm}>
                {t("user.profile.phoneSection")}
              </h2>
              <p
                className={`${DesignTokens.inputs.labelFontSize} ${DesignTokens.typography.muted}`}
              >
                {t("user.profile.phoneHint")}
              </p>
            </div>
            <AppDivider />
            <ChangePhoneForm currentPhoneNumber={profile.phoneNumber} />
          </AppFormSection>
        </AppIdentitySplit>
      </AppFormPage>
    </div>
  );
};

export default ProfilePage;
