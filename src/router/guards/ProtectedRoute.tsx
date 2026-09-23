import { Navigate, Outlet } from "react-router";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";

const ProtectedRoute = () => {
  const token = localStorage.getItem("ALHARMEEN_TOKEN");
  if (!token) {
    return <Navigate to={AUTH_ROUTES.login} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
