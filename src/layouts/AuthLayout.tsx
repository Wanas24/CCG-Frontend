import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { ConfigProvider } from "antd";
import { useTranslation } from "react-i18next";
import { applyCssVariables, authCssVariables, authTheme } from "@/AntdTheme";
import { AppLocaleSwitcher, useLocale } from "@/i18n";

const AuthLayout = () => {
  const { t } = useTranslation();
  const { direction, antdLocale } = useLocale();
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shellRef.current) {
      applyCssVariables(authCssVariables, shellRef.current);
    }
  }, []);

  return (
    <ConfigProvider theme={authTheme} direction={direction} locale={antdLocale}>
      <div
        ref={shellRef}
        className="relative flex min-h-dvh w-full flex-col bg-(--app-bg) text-(--app-text)"
      >
        <header className="flex items-center justify-between px-6 py-4">
          <span className="text-xl font-semibold tracking-wide text-(--naturalBlack)">
            {t("common.appName")}
          </span>
          <AppLocaleSwitcher />
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-2xl border border-(--Grey300) bg-(--app-surface) p-8 shadow-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </ConfigProvider>
  );
};

export default AuthLayout;
