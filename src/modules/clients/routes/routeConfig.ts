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
        ],
      },
    ],
  },
];

export default clientsRouteConfig;
