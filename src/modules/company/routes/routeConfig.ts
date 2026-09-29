import { lazy } from "react";
import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import CompanyOnboardingRoute from "./CompanyOnboardingRoute";
import { COMPANY_ROUTES } from "./paths";

const CompanyPage = lazy(() => import("../pages/CompanyPage"));
const CreateCompanyPage = lazy(() => import("../pages/CreateCompanyPage"));
const CreateOrJoinCompanyPage = lazy(
  () => import("../pages/CreateOrJoinCompanyPage"),
);
const JoinCompanyPage = lazy(() => import("../pages/JoinCompanyPage"));

const companyRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: CompanyOnboardingRoute,
        children: [
          {
            path: COMPANY_ROUTES.onboarding,
            Component: CreateOrJoinCompanyPage,
            label: "company.onboarding.title",
            showInMenu: false,
          },
          {
            path: COMPANY_ROUTES.join,
            Component: JoinCompanyPage,
            label: "company.join.title",
            showInMenu: false,
          },
        ],
      },
      {
        Component: AppLayout,
        children: [
          {
            path: COMPANY_ROUTES.root,
            Component: CompanyPage,
            label: "company.page.title",
            showInMenu: false,
          },
          {
            path: COMPANY_ROUTES.create,
            Component: CreateCompanyPage,
            label: "company.create.title",
            showInMenu: false,
          },
        ],
      },
    ],
  },
];

export default companyRouteConfig;
