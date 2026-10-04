import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import CompanyOnboardingRoute from "./CompanyOnboardingRoute";
import { COMPANY_ROUTES } from "./paths";

const companyRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: CompanyOnboardingRoute,
        children: [
          {
            path: COMPANY_ROUTES.onboarding,
            label: "company.onboarding.title",
            showInMenu: false,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/CreateOrJoinCompanyPage"
              );
              return { Component };
            },
          },
          {
            path: COMPANY_ROUTES.join,
            label: "company.join.title",
            showInMenu: false,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/JoinCompanyPage"
              );
              return { Component };
            },
          },
        ],
      },
      {
        Component: AppLayout,
        children: [
          {
            path: COMPANY_ROUTES.root,
            label: "company.page.title",
            showInMenu: false,
            lazy: async () => {
              const { default: Component } = await import("../pages/CompanyPage");
              return { Component };
            },
          },
          {
            path: COMPANY_ROUTES.create,
            label: "company.create.title",
            showInMenu: false,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/CreateCompanyPage"
              );
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default companyRouteConfig;
