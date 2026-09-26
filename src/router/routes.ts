import { createBrowserRouter, type RouteObject } from "react-router";
import authRouteConfig from "@/modules/authentication/routes/routeConfig";
import appRouteConfig from "@/modules/standalone/routes/routeConfig";
import NotFound from "@/modules/standalone/pages/NotFound";
import RootLayout from "@/layouts/RootLayout";
import type { AppRouteObject } from "./types";
import usersRouteConfig from "@/modules/user/routes/routeConfig";

const routes: AppRouteObject[] = [
  {
    Component: RootLayout,
    children: [
      ...authRouteConfig,
      ...appRouteConfig,
      ...usersRouteConfig,
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
];

export const router = createBrowserRouter(routes as RouteObject[]);
