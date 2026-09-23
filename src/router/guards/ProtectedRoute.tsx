import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
// import { authSession } from "@/modules/authentication/store/authSession";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";

interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("ALHARMEEN_TOKEN");
  if (!token) {
    return <Navigate to={AUTH_ROUTES.login} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
