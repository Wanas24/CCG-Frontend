import { useEffect, useRef, ViewTransition } from "react";
import { Outlet } from "react-router";
import { ConfigProvider } from "antd";
import { applyCssVariables, authCssVariables, authTheme } from "@/AntdTheme";
import { useLocale } from "@/i18n";
import LayoutShowcase from "@/modules/authentication/components/LayoutShowcase/LayoutShowcase";

const AuthLayout = () => {
  const { direction, antdLocale } = useLocale();
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shellRef.current) {
      applyCssVariables(authCssVariables, shellRef.current);
    }
  }, []);

  return (
    <ConfigProvider theme={authTheme} direction={direction} locale={antdLocale}>
      <div ref={shellRef} className="flex min-h-dvh w-full text-(--app-text)">
        <div className="hidden lg:flex lg:w-[55%] flex-shrink-0">
          <LayoutShowcase />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center bg-(--app-surface) px-8 py-12">
          <div className="w-full max-w-xl p-5 rounded-xl">
            <ViewTransition>
              <Outlet />
            </ViewTransition>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AuthLayout;
