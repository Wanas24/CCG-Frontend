import { Navigate, Outlet } from "react-router";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import PageLoader from "@/shared/components/PageLoader/PageLoader";

const PublicRoute = () => {
  const { isAuthenticated, isInitialized, isVerified } = useAuthStore();

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={isVerified ? APP_ROUTES.home : AUTH_ROUTES.verifyAccount}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PublicRoute;
