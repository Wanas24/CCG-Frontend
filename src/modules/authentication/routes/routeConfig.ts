import AuthLayout from "@/layouts/AuthLayout";
import VerifyAccountLayout from "@/layouts/VerifyAccountLayout";
import PublicRoute from "@/router/guards/PublicRoute";
import VerifyAccountRoute from "@/router/guards/VerifyAccountRoute";
import type { AppRouteObject } from "@/router/types";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import SignupPage from "../pages/SignupPage";
import { AUTH_ROUTES } from "./paths";
import ConfirmEmailPage from "../pages/ConfirmEmailPage";
import VerifyAccountPage from "../pages/VerifyAccountPage";

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
  {
    Component: AuthLayout,
    showInMenu: false,
    children: [
      {
        path: AUTH_ROUTES.confirmEmail,
        Component: ConfirmEmailPage,
        label: "auth.confirmEmail.title",
        showInMenu: false,
      },
    ],
  },
  {
    Component: VerifyAccountRoute,
    children: [
      {
        Component: VerifyAccountLayout,
        showInMenu: false,
        children: [
          {
            path: AUTH_ROUTES.verifyAccount,
            Component: VerifyAccountPage,
            label: "auth.verifyAccount.title",
            showInMenu: false,
          },
        ],
      },
    ],
  },
];

export default authRouteConfig;
