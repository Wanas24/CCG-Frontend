import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { AppButton } from "@/shared/ANTD_UIComponents";
import AppRoundedContainer from "@/shared/ANTD_UIComponents/AppRoundedContainer";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { COMPANY_ROUTES } from "../routes/paths";

const nextSteps = [
  "company.join.stepShare",
  "company.join.stepInvite",
  "company.join.stepJoin",
] as const;

const JoinCompanyView = () => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const email = useAuthStore((state) => state.user?.email ?? "");
  const { copied, copy } = useCopyToClipboard();
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const year = new Date().getFullYear();

  return (
    <section className="relative flex min-h-[calc(100dvh-5rem)] flex-col overflow-hidden bg-(--app-bg)">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--Grey200)_1px,transparent_1px),linear-gradient(to_bottom,var(--Grey200)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-16 top-8 size-56 rounded-full bg-(--Primary100) blur-3xl motion-safe:animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute end-0 bottom-0 size-72 rounded-full bg-(--Grey200) blur-3xl"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8 px-6 py-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/ccg_logo.png"
              alt=""
              className="size-10 shrink-0 rounded-xl object-contain"
            />
            <div className="min-w-0">
              <p className={clsx(DesignTokens.typography.emphasis, "truncate")}>
                {t("common.appName")}
              </p>
              <p
                className={clsx(
                  DesignTokens.inputs.labelFontSize,
                  DesignTokens.typography.muted,
                  "truncate tracking-wide uppercase",
                )}
              >
                {t("company.join.workspace")}
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-(--app-text) sm:text-4xl">
            {t("company.join.headline")}
          </h1>
          <p
            className={clsx(
              DesignTokens.inputs.labelFontSize,
              DesignTokens.typography.muted,
              "max-w-md leading-relaxed",
            )}
          >
            {t("company.join.intro")}
          </p>
        </div>

        <AppRoundedContainer
          whiteBG
          className="flex w-full max-w-xl flex-col gap-5 border-(--Grey300) lg:w-[28rem]"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-(--app-text)">
              {t("company.join.title")}
            </h2>
            <p
              className={clsx(
                DesignTokens.inputs.labelFontSize,
                DesignTokens.typography.muted,
                "leading-relaxed",
              )}
            >
              {t("company.join.explanation")}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p
              className={clsx(
                DesignTokens.inputs.labelFontSize,
                DesignTokens.typography.muted,
              )}
            >
              {t("company.join.emailLabel")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-(--Grey300) bg-(--Grey100) px-3 py-2">
                <Mail
                  size={DesignTokens.media.iconSm}
                  className="shrink-0 text-(--Primary400)"
                  aria-hidden
                />
                <span
                  className={clsx(
                    DesignTokens.inputs.labelFontSize,
                    DesignTokens.typography.emphasis,
                    "min-w-0 break-all",
                  )}
                >
                  {email || t("company.join.emailUnavailable")}
                </span>
              </div>
              <AppButton
                variant="primary"
                htmlType="button"
                disabled={!email}
                aria-label={
                  copied
                    ? t("company.join.copied")
                    : t("company.join.copyAria", { email })
                }
                onClick={() => {
                  void copy(email);
                }}
                className="h-10! w-full shrink-0 sm:w-fit"
              >
                {copied ? t("company.join.copied") : t("company.join.copy")}
              </AppButton>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className={DesignTokens.typography.emphasis}>
              {t("company.join.nextTitle")}
            </p>
            <ol className="flex flex-col gap-2">
              {nextSteps.map((key, index) => (
                <li key={key} className="flex items-start gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--Primary100) text-(--Primary400)">
                    <Check size={14} aria-hidden />
                  </span>
                  <span
                    className={clsx(
                      DesignTokens.inputs.labelFontSize,
                      DesignTokens.typography.muted,
                      "leading-relaxed",
                    )}
                  >
                    <span className="sr-only">{index + 1}. </span>
                    {t(key)}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <Link to={COMPANY_ROUTES.onboarding} className="w-fit">
            <AppButton
              variant="default"
              htmlType="button"
              icon={<BackArrow size={DesignTokens.media.iconSm} aria-hidden />}
              className="px-0!"
            >
              {t("company.join.back")}
            </AppButton>
          </Link>
        </AppRoundedContainer>
      </div>

      <p
        className={clsx(
          "relative z-10 px-6 pb-6 text-center",
          DesignTokens.inputs.labelFontSize,
          DesignTokens.typography.muted,
        )}
      >
        {t("company.join.footer", { year })}
      </p>
    </section>
  );
};

export default JoinCompanyView;
