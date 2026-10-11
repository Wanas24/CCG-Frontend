import { useState } from "react";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useAiAssistantSession } from "../hooks/useAiAssistantSession";
import AiAssistantHint from "./AiAssistantHint";
import AiAssistantLauncher from "./AiAssistantLauncher";
import AiAssistantPanel from "./AiAssistantPanel";

const AiAssistantController = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useAiAssistantSession();

  return (
    <>
      {!isOpen && <AiAssistantHint />}
      {isOpen ? (
        <AiAssistantPanel session={session} onClose={() => setIsOpen(false)} />
      ) : null}
      <AiAssistantLauncher
        isOpen={isOpen}
        onToggle={() => setIsOpen((current) => !current)}
      />
    </>
  );
};

const AiAssistant = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const { hasPermission, isLoading: isPermissionsLoading } = usePermissions();

  if (!isAuthenticated || isPermissionsLoading) {
    return null;
  }

  if (!companyId) {
    return null;
  }

  if (!hasPermission(PermissionsList.Ai.AiAssistantChat)) {
    return null;
  }

  return <AiAssistantController key={companyId} />;
};

export default AiAssistant;
