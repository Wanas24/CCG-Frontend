import { createBrowserRouter, type RouteObject } from "react-router";
import authRouteConfig from "@/modules/authentication/routes/routeConfig";
import appRouteConfig from "@/modules/standalone/routes/routeConfig";
import userRouteConfig from "@/modules/user/routes/routeConfig";
import companyRouteConfig from "@/modules/company/routes/routeConfig";
import aiRouteConfig from "@/modules/ai/routes/routeConfig";
import userControlRouteConfig from "@/modules/userControl/routes/routeConfig";
import approvalRouteConfig from "@/modules/approval/routes/routeConfig";
import reportLayoutRouteConfig from "@/modules/reportLayout/routes/routeConfig";
import NotFound from "@/modules/standalone/pages/NotFound";
import RootLayout from "@/layouts/RootLayout";
import type { AppRouteObject } from "./types";

const routes: AppRouteObject[] = [
  {
    Component: RootLayout,
    children: [
      ...authRouteConfig,
      ...appRouteConfig,
      ...userRouteConfig,
      ...companyRouteConfig,
      ...aiRouteConfig,
      ...userControlRouteConfig,
      ...approvalRouteConfig,
      ...reportLayoutRouteConfig,
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
];

export const router = createBrowserRouter(routes as RouteObject[]);
