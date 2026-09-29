import { ArrowLeft, ArrowRight, Building2, UserPlus } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { AppButton } from "@/shared/ANTD_UIComponents";
import AppRoundedContainer from "@/shared/ANTD_UIComponents/AppRoundedContainer";
import { COMPANY_ROUTES } from "../routes/paths";

type OptionCardProps = {
  icon: typeof Building2;
  title: string;
  description: string;
  actionLabel: string;
  to: string;
};

const OptionCard = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  to,
}: OptionCardProps) => {
  const { isRtl } = useLocale();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <AppRoundedContainer
      whiteBG
      className="flex h-full flex-col gap-4 border-(--Grey300) transition-colors hover:border-(--Primary300)"
    >
      <div
        className={clsx(
          "flex size-10 items-center justify-center rounded-xl bg-(--Primary100) text-(--Primary400)",
        )}
      >
        <Icon size={DesignTokens.media.iconMd} aria-hidden />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className={DesignTokens.typography.headingSm}>{title}</h2>
        <p
          className={clsx(
            DesignTokens.inputs.labelFontSize,
            DesignTokens.typography.muted,
            "leading-relaxed",
          )}
        >
          {description}
        </p>
      </div>

      <Link to={to} className="mt-auto block w-full sm:w-fit">
        <AppButton
          variant="primary"
          htmlType="button"
          icon={<ArrowIcon size={DesignTokens.media.iconSm} aria-hidden />}
          iconPlacement="end"
          className="w-full sm:w-fit"
        >
          {actionLabel}
        </AppButton>
      </Link>
    </AppRoundedContainer>
  );
};

const CreateOrJoinCompanyView = () => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex max-w-xl flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-(--app-text)">
          {t("company.onboarding.title")}
        </h1>
        <p
          className={clsx(
            DesignTokens.inputs.labelFontSize,
            DesignTokens.typography.muted,
            "leading-relaxed",
          )}
        >
          {t("company.onboarding.subtitle")}
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <OptionCard
          icon={Building2}
          title={t("company.onboarding.createTitle")}
          description={t("company.onboarding.createDescription")}
          actionLabel={t("company.onboarding.createAction")}
          to={COMPANY_ROUTES.create}
        />
        <OptionCard
          icon={UserPlus}
          title={t("company.onboarding.joinTitle")}
          description={t("company.onboarding.joinDescription")}
          actionLabel={t("company.onboarding.joinAction")}
          to={COMPANY_ROUTES.join}
        />
      </div>

      <Link to={APP_ROUTES.home} className="w-fit">
        <AppButton
          variant="default"
          htmlType="button"
          icon={<BackArrow size={DesignTokens.media.iconSm} aria-hidden />}
          className="px-0!"
        >
          {t("company.onboarding.backToDashboard")}
        </AppButton>
      </Link>
    </div>
  );
};

export default CreateOrJoinCompanyView;
