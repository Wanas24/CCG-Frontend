import { Navigate, Outlet } from "react-router";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import PageLoader from "@/shared/components/PageLoader/PageLoader";

const PublicRoute = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
