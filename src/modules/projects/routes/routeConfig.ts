import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { PROJECTS_ROUTES } from "./paths";

const projectsRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: PROJECTS_ROUTES.root,
            label: "projects.title",
            showInMenu: false,
            order: 18,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/ProjectsPage"
              );
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default projectsRouteConfig;
