import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { CLIENTS_ROUTES } from "./paths";

const clientsRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: CLIENTS_ROUTES.root,
            label: "clients.title",
            showInMenu: false,
            order: 19,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/ClientsPage"
              );
              return { Component };
            },
          },
          {
            path: CLIENTS_ROUTES.detail,
            label: "clients.workspace.title",
            showInMenu: false,
            lazy: async () => {
              const { default: Component } = await import(
                "../layouts/ClientWorkspaceLayout"
              );
              return { Component };
            },
            children: [
              {
                index: true,
                lazy: async () => {
                  const { default: Component } = await import(
                    "../pages/ClientWorkspaceIndexRedirect"
                  );
                  return { Component };
                },
              },
              {
                path: ":section",
                lazy: async () => {
                  const { default: Component } = await import(
                    "../pages/ClientWorkspaceSectionPage"
                  );
                  return { Component };
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export default clientsRouteConfig;
