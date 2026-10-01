import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppThemeProvider } from "@/AntdTheme";
import { useLocale } from "@/i18n/useLocale";
import { queryClient } from "@/lib/queryClient";
import AuthInitializer from "@/modules/authentication/components/AuthInitializer";
import CurrentUserPermissions from "@/modules/user/components/CurrentUserPermissions";
import NotificationsRuntime from "@/modules/user/components/NotificationsRuntime";

type Props = {
  children: ReactNode;
};

const AppProviders = ({ children }: Props) => {
  const { isRtl } = useLocale();

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthInitializer />
        <CurrentUserPermissions />
        <NotificationsRuntime />
        {children}
        <ToastContainer
          position={isRtl ? "top-left" : "top-right"}
          rtl={isRtl}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </AppThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProviders;
