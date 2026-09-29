import { useState } from "react";
import AiAssistantHint from "./AiAssistantHint";
import AiAssistantLauncher from "./AiAssistantLauncher";
import AiAssistantPanel from "./AiAssistantPanel";

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && <AiAssistantHint />}
      {isOpen && <AiAssistantPanel onClose={() => setIsOpen(false)} />}
      <AiAssistantLauncher
        isOpen={isOpen}
        onToggle={() => setIsOpen((current) => !current)}
      />
    </>
  );
};

export default AiAssistant;
