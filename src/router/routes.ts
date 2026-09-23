import { createBrowserRouter, type RouteObject } from "react-router";
import authRouteConfig from "@/modules/authentication/routes/routeConfig";
import appRouteConfig from "@/modules/standalone/routes/routeConfig";
import RootLayout from "@/layouts/RootLayout";
import type { AppRouteObject } from "./types";

const routes: AppRouteObject[] = [
  {
    Component: RootLayout,
    children: [...authRouteConfig, ...appRouteConfig],
  },
];

export const router = createBrowserRouter(routes as RouteObject[]);
