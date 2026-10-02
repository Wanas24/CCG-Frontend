import { AppLocaleSwitcher } from "@/i18n";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Sparkles, Mail } from "lucide-react";
import FeatureCard from "./FeatureCard";

const LayoutShowcase = () => {
  const { t } = useTranslation();

  const contacts = [
    {
      title: t("auth.showcase.contact.info.title"),
      subtitle: t("auth.showcase.contact.info.subtitle"),
      email: t("auth.showcase.contact.info.email"),
    },
    {
      title: t("auth.showcase.contact.sales.title"),
      subtitle: t("auth.showcase.contact.sales.subtitle"),
      email: t("auth.showcase.contact.sales.email"),
    },
    {
      title: t("auth.showcase.contact.hr.title"),
      subtitle: t("auth.showcase.contact.hr.subtitle"),
      email: t("auth.showcase.contact.hr.email"),
    },
  ] as const;

  return (
    <div
      className="relative flex flex-col w-full min-h-dvh overflow-hidden"
      style={{
        background: "color-mix(in srgb, var(--Primary400) 5%, var(--app-bg))",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 30% 40%, color-mix(in srgb, var(--Primary400) 12%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 85% 30%, color-mix(in srgb, var(--Secondary300) 8%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-10 py-8 min-h-dvh">
        <div className="flex w-full flex-wrap items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-(--Primary100) border border-(--Grey300) flex items-center justify-center">
            <ShieldCheck
              className="w-4.5 h-4.5 text-(--Primary400)"
              strokeWidth={1.75}
              aria-hidden
            />
          </div>
          <span className="text-lg font-bold tracking-wide text-(--app-text)">
            {t("common.appName")}
          </span>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-(--Primary100) text-(--Primary400) tracking-widest uppercase">
            {t("auth.showcase.badge")}
          </span>
          <div className="ms-auto rounded-xl bg-(--Grey200)">
            <AppLocaleSwitcher />
          </div>
        </div>

        <div className="flex flex-col flex-1 justify-center gap-5 py-12 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles
              className="w-4 h-4 text-(--Primary400)"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-(--Grey600)">
              {t("auth.showcase.eyebrow")}
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-(--app-text)">
            {t("auth.showcase.headline")}
          </h1>

          <p className="text-[15px] text-(--Grey600) max-w-md leading-relaxed">
            {t("auth.showcase.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-auto mb-5">
          {contacts.map(({ title, subtitle, email }) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--Primary400) rounded-2xl"
              aria-label={`${title}: ${email}`}
            >
              <FeatureCard
                icon={Mail}
                title={title}
                description={subtitle}
                email={email}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayoutShowcase;
