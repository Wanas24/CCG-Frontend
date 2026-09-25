import { Navigate, Outlet } from "react-router";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import PageLoader from "@/shared/components/PageLoader/PageLoader";

const ProtectedRoute = () => {
  const { isAuthenticated, isInitialized, isVerified } = useAuthStore();

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.login} replace />;
  }

  if (!isVerified) {
    return <Navigate to={AUTH_ROUTES.verifyAccount} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
