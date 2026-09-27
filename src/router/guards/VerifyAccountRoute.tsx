import { Navigate, Outlet } from "react-router";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { isAccountVerified } from "@/modules/authentication/types";
import PageLoader from "@/shared/components/PageLoader/PageLoader";

/**
 * Authenticated verify flow with its own layout (not AuthLayout / AppLayout).
 * User may leave to home anytime; errorCode 1 navigates here again.
 */
const VerifyAccountRoute = () => {
  const { isAuthenticated, isInitialized, confirmationStatus } = useAuthStore();

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.login} replace />;
  }

  if (isAccountVerified(confirmationStatus)) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <Outlet />;
};

export default VerifyAccountRoute;
