import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { AppThemeProvider } from "@/AntdTheme";
import { queryClient } from "@/lib/queryClient";
import AuthInitializer from "@/modules/authentication/components/AuthInitializer";

type Props = {
  children: ReactNode;
};

const AppProviders = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>
    <AppThemeProvider>
      <AuthInitializer />
      {children}
    </AppThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default AppProviders;
