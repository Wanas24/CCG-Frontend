import { lazy } from "react";
import PublicRoute from "@/router/guards/PublicRoute";
import type { AppRouteObject } from "@/router/types";
import { AUTH_ROUTES } from "./paths";

const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));

const authRouteConfig: AppRouteObject[] = [
  {
    Component: PublicRoute,
    children: [
      {
        path: AUTH_ROUTES.root,
        Component: AuthLayout,
        showInMenu: false,
        children: [
          // {
          //   index: true,
          //   loader: () => redirect(AUTH_ROUTES.login),
          // },

          {
            path: "login",
            Component: LoginPage,
            label: "auth.login.title",
            showInMenu: false,
          },

          {
            path: "signup",
            Component: SignupPage,
            label: "auth.signup.title",
            showInMenu: false,
          },

          {
            path: "forgot-password",
            Component: ForgotPasswordPage,
            label: "auth.forgotPassword.title",
            showInMenu: false,
          },

          {
            path: "reset-password",
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
