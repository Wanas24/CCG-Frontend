import AuthLayout from "@/layouts/AuthLayout";
import PublicRoute from "@/router/guards/PublicRoute";
import type { AppRouteObject } from "@/router/types";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import SignupPage from "../pages/SignupPage";
import { AUTH_ROUTES } from "./paths";

const authRouteConfig: AppRouteObject[] = [
  {
    Component: PublicRoute,
    children: [
      {
        Component: AuthLayout,
        showInMenu: false,
        children: [
          {
            index: true,
            Component: LoginPage,
            label: "auth.login.title",
            showInMenu: false,
          },
          {
            path: AUTH_ROUTES.signup,
            Component: SignupPage,
            label: "auth.signup.title",
            showInMenu: false,
          },
          {
            path: AUTH_ROUTES.forgotPassword,
            Component: ForgotPasswordPage,
            label: "auth.forgotPassword.title",
            showInMenu: false,
          },
          {
            path: AUTH_ROUTES.resetPassword,
            Component: ResetPasswordPage,
            label: "auth.resetPassword.title",
            showInMenu: false,
          },
        ],
      },
    ],
  },
];

export default authRouteConfig;
