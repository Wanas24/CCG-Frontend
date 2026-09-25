import { Navigate, Outlet } from "react-router";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import PageLoader from "@/shared/components/PageLoader/PageLoader";

const VerifyAccountRoute = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.login} replace />;
  }

  return <Outlet />;
};

export default VerifyAccountRoute;
