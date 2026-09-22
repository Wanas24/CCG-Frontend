import { createBrowserRouter, redirect, type RouteObject } from "react-router";
import authRouteConfig from "@/modules/authentication/routes/routeConfig";
import appRouteConfig from "@/modules/standalone/routes/routeConfig";
import type { AppRouteObject } from "./types";

const routes: AppRouteObject[] = [
  {
    index: true,
    loader: () => redirect("/home"),
  },
  ...authRouteConfig,
  ...appRouteConfig,
];

export const router = createBrowserRouter(routes as RouteObject[]);
