import type { TFunction } from "i18next";
import { Home, ShieldCheck } from "lucide-react";
import { AI_ROUTES } from "@/modules/ai/routes/paths";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import type { MenuItemConfig } from "@/shared/ANTD_UIComponents";

export const createAppSidebarMenu = (t: TFunction): MenuItemConfig[] => [
  {
    key: "home",
    label: t("home.navLabel"),
    path: APP_ROUTES.home,
    icon: <Home size={18} />,
  },
  {
    key: "ai-subscriptions",
    label: t("ai.subscriptions.navLabel"),
    path: AI_ROUTES.subscriptions,
    icon: <ShieldCheck size={18} />,
    permissions: [PermissionsList.AiSubscriptionGet],
  },
];
