import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppTag } from "@/shared/ANTD_UIComponents";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import {
  PermissionsList,
  type AppPermission,
} from "@/modules/user/permissions/PermissionsList";
import { useTranslation } from "react-i18next";
import HomePermissionsPanelSkeleton from "./HomePermissionsPanelSkeleton";

const permissionGroups = Object.entries(PermissionsList).map(
  ([group, permissions]) => ({
    group,
    permissions: Object.values(permissions) as AppPermission[],
  }),
);

const HomePermissionsPanel = () => {
  const { t } = useTranslation();
  const { hasPermission, isAdmin, isManager, isLoading, isError } =
    usePermissions();

  if (isLoading) {
    return <HomePermissionsPanelSkeleton />;
  }

  if (isError) {
    return (
      <p className="m-0 text-sm text-(--statusR200)">
        {t("home.permissions.error")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <AppTag variant={isAdmin ? "active" : "draft"}>
          {t("home.permissions.admin")}: {isAdmin ? t("home.permissions.yes") : t("home.permissions.no")}
        </AppTag>
        <AppTag variant={isManager ? "active" : "draft"}>
          {t("home.permissions.manager")}: {isManager ? t("home.permissions.yes") : t("home.permissions.no")}
        </AppTag>
      </div>

      <div className="flex flex-col gap-4">
        {permissionGroups.map(({ group, permissions }) => (
          <section
            key={group}
            className="rounded-xl border border-(--Grey300) bg-(--app-surface) p-4"
          >
            <h2 className={DesignTokens.typography.headingSm}>{group}</h2>
            <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
              {permissions.map((permission) => {
                const granted = hasPermission(permission);
                return (
                  <li
                    key={permission}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-(--Grey300) pb-2 last:border-b-0 last:pb-0"
                  >
                    <span className="text-sm text-(--app-text)">{permission}</span>
                    <AppTag variant={granted ? "active" : "rejected"}>
                      {granted
                        ? t("home.permissions.granted")
                        : t("home.permissions.denied")}
                    </AppTag>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default HomePermissionsPanel;
