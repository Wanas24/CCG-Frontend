import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  const {
    permissions,
    isAdmin,
    isManager,
    hasPermission,
    isLoading,
    isError,
  } = usePermissions();

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-(--app-text)">
        {t("common.appName")}
      </h1>

      <div className="mt-4">
        <p>Loading: {String(isLoading)}</p>
        <p>Error: {String(isError)}</p>
        <p>Admin: {String(isAdmin)}</p>
        <p>Manager: {String(isManager)}</p>
        <p>Permissions count: {permissions.length}</p>

        <p>
          Project.Get: {String(hasPermission("Project.Get"))}
        </p>

        <p>
          Project.Create: {String(hasPermission("Project.Create"))}
        </p>

        <p>
          Fake.Permission: {String(hasPermission("Fake.Permission"))}
        </p>
      </div>
    </div>
  );
};

export default HomePage;