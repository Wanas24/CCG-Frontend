import { lazy } from "react";
import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { COMPANY_ROUTES } from "./paths";

const CompanyPage = lazy(() => import("../pages/CompanyPage"));
const CreateCompanyPage = lazy(() => import("../pages/CreateCompanyPage"));

const companyRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
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
