import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { userControlAccessPermissions } from "@/modules/userControl/utils/userControlAccess";
import { createAppSidebarMenu } from "./createAppSidebarMenu";

export const useAppSidebarNavigation = () => {
  const { t } = useTranslation();
  const { permissions, isAdmin, isManager } = usePermissions();

  const grantedPermissions = useMemo(() => {
    const names = permissions.map((permission) => permission.name);
    if (!isAdmin && !isManager) return names;
    return [...new Set([...names, ...userControlAccessPermissions])];
  }, [isAdmin, isManager, permissions]);

  const menuConfig = useMemo(() => createAppSidebarMenu(t), [t]);

  return {
    menuConfig,
    grantedPermissions,
  };
};
