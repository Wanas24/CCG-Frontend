import type { TFunction } from "i18next";
import {
  Bell,
  FileText,
  GitBranch,
  Home,
  ListTree,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { AI_ROUTES } from "@/modules/ai/routes/paths";
import { ALERTS_ROUTES } from "@/modules/alerts/routes/paths";
import { APPROVAL_ROUTES } from "@/modules/approval/routes/paths";
import { approvalMenuPermissions } from "@/modules/approval/utils/approvalAccess";
import { LISTS_ROUTES } from "@/modules/lists/routes/paths";
import { REPORT_LAYOUT_ROUTES } from "@/modules/reportLayout/routes/paths";
import { reportLayoutAccessPermissions } from "@/modules/reportLayout/utils/reportLayoutAccess";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { USER_CONTROL_ROUTES } from "@/modules/userControl/routes/paths";
import { userControlAccessPermissions } from "@/modules/userControl/utils/userControlAccess";
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
    key: "alerts",
    label: t("alerts.navLabel"),
    path: ALERTS_ROUTES.alerts,
    icon: <Bell size={18} />,
  },
  {
    key: "lists",
    label: t("lists.navLabel"),
    path: LISTS_ROUTES.lists,
    icon: <ListTree size={18} />,
  },
  {
    key: "settings",
    label: t("settings.navLabel"),
    icon: <Settings size={18} />,
    children: [
      {
        key: "ai-subscriptions",
        label: t("ai.subscriptions.navLabel"),
        path: AI_ROUTES.subscriptions,
        icon: <ShieldCheck size={18} />,
        permissions: [PermissionsList.Ai.AiSubscriptionGet],
      },
      {
        key: "user-control",
        label: t("userControl.navLabel"),
        path: USER_CONTROL_ROUTES.userControl,
        icon: <UserCog size={18} />,
        permissions: [...userControlAccessPermissions],
      },
      {
        key: "users-manager",
        label: t("userControl.usersManager.navLabel"),
        path: USER_CONTROL_ROUTES.usersManager,
        icon: <Users size={18} />,
        permissions: [PermissionsList.Employee.Get],
      },
      {
        key: "approval",
        label: t("approval.navLabel"),
        path: APPROVAL_ROUTES.approval,
        icon: <GitBranch size={18} />,
        permissions: [...approvalMenuPermissions],
      },
      {
        key: "report-layouts",
        label: t("reportLayout.navLabel"),
        path: REPORT_LAYOUT_ROUTES.studio,
        icon: <FileText size={18} />,
        permissions: [...reportLayoutAccessPermissions],
      },
    ],
  },
];
