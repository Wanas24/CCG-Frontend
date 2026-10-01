import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";

const CompanyOnboardingRoute = () => {
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  if (companyId !== null) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <Outlet />;
};

export default CompanyOnboardingRoute;
