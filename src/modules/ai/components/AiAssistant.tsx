import { useState } from "react";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import AiAssistantHint from "./AiAssistantHint";
import AiAssistantLauncher from "./AiAssistantLauncher";
import AiAssistantPanel from "./AiAssistantPanel";

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return (
    <>
      {!isOpen && <AiAssistantHint />}
      {isOpen && (
        <AiAssistantPanel
          key={companyId ?? "no-company"}
          onClose={() => setIsOpen(false)}
        />
      )}
      <AiAssistantLauncher
        isOpen={isOpen}
        onToggle={() => setIsOpen((current) => !current)}
      />
    </>
  );
};

export default AiAssistant;
