import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { createAppSidebarMenu } from "./createAppSidebarMenu";

export const useAppSidebarNavigation = () => {
  const { t } = useTranslation();
  const { permissions } = usePermissions();

  const grantedPermissions = useMemo(
    () => permissions.map((permission) => permission.name),
    [permissions],
  );

  const menuConfig = useMemo(() => createAppSidebarMenu(t), [t]);

  return {
    menuConfig,
    grantedPermissions,
  };
};
