import { Suspense } from "react";
import { Outlet } from "react-router";
import AiAssistant from "@/modules/ai/components/AiAssistant";
import { AppNavbar } from "@/shared/components";
import { NavigationProgressFallback } from "@/shared/components/NavigationProgress/NavigationProgress";

const AppLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-(--app-bg) text-(--app-text)">
      <AppNavbar />
      <Suspense fallback={<NavigationProgressFallback />}>
        <Outlet />
      </Suspense>
      <AiAssistant />
    </div>
  );
};

export default AppLayout;
