import { Navigate, Outlet } from "react-router";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";

const PublicRoute = () => {
  const token = localStorage.getItem("ALHARMEEN_TOKEN");
  if (token) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
