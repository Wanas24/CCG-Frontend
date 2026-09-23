import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
// import { authSession } from "@/modules/authentication/store/authSession";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";

interface PublicRouteProps {
  children?: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = localStorage.getItem("ALHARMEEN_TOKEN");
  if (token) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
