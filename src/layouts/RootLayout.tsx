import { Suspense } from "react";
import { Outlet } from "react-router";
import NavigationProgress, {
  NavigationProgressFallback,
} from "@/shared/components/NavigationProgress/NavigationProgress";

const RootLayout = () => {
  return (
    <>
      <NavigationProgress />
      <Suspense fallback={<NavigationProgressFallback />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default RootLayout;
