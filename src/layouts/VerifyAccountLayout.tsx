import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { AppLocaleSwitcher } from "@/i18n";
import AppThemeToggle from "@/shared/components/AppThemeToggle";

const VerifyAccountLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-(--app-bg) text-(--app-text)">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            linear-gradient(160deg, color-mix(in srgb, var(--statusB200) 12%, transparent) 0%, transparent 42%),
            linear-gradient(345deg, color-mix(in srgb, var(--statusY200) 10%, transparent) 0%, transparent 38%),
            repeating-linear-gradient(
              -18deg,
              transparent,
              transparent 11px,
              color-mix(in srgb, var(--Grey300) 55%, transparent) 11px,
              color-mix(in srgb, var(--Grey300) 55%, transparent) 12px
            )
          `,
        }}
      />

      <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-(--Grey300)/70 px-5 py-3 sm:px-8">
        <p className="text-sm font-semibold tracking-wide text-(--app-text)">
          {t("common.appName")}
        </p>
        <div className="flex items-center gap-2">
          <AppThemeToggle />
          <AppLocaleSwitcher />
        </div>
      </header>

      <main className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto flex min-h-full w-full max-w-2xl items-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VerifyAccountLayout;
