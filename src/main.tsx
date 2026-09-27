import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import "@/i18n";
import { router } from "@/router/routes";
import AppProviders from "@/providers/AppProviders";
import { getDeviceId } from "@/services/deviceId";

// Ensure a stable deviceId exists before the first render.
getDeviceId();

createRoot(document.getElementById("root")!).render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
);
