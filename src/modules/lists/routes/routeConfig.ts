import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { LISTS_ROUTES } from "./paths";

const listsRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: LISTS_ROUTES.lists,
            label: "lists.title",
            showInMenu: false,
            order: 25,
            lazy: async () => {
              const { default: Component } = await import("../pages/ListsPage");
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default listsRouteConfig;
