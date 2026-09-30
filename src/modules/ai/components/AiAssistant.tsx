import { useState } from "react";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import AiAssistantHint from "./AiAssistantHint";
import AiAssistantLauncher from "./AiAssistantLauncher";
import AiAssistantPanel from "./AiAssistantPanel";

const AiAssistant = () => {
  const [openForCompanyId, setOpenForCompanyId] = useState<number | null>(
    null,
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const { hasPermission, isLoading: isPermissionsLoading } = usePermissions();

  const isOpen =
    companyId !== null &&
    openForCompanyId !== null &&
    openForCompanyId === companyId;

  if (!isAuthenticated || isPermissionsLoading) {
    return null;
  }

  if (!companyId) {
    return null;
  }

  if (!hasPermission(PermissionsList.AiAssistantChat)) {
    return null;
  }

  return (
    <>
      {!isOpen && <AiAssistantHint />}
      {isOpen && (
        <AiAssistantPanel
          key={companyId}
          onClose={() => setOpenForCompanyId(null)}
        />
      )}
      <AiAssistantLauncher
        isOpen={isOpen}
        onToggle={() => {
          setOpenForCompanyId((current) =>
            current === companyId ? null : companyId,
          );
        }}
      />
    </>
  );
};

export default AiAssistant;
