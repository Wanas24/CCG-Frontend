import { useTranslation } from "react-i18next";
import { Sparkles, X } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
};

const AiAssistantLauncher = ({ isOpen, onToggle }: Props) => {
  const { t } = useTranslation();

  return (
    <AppButton
      shape="circle"
      aria-label={isOpen ? t("ai.launcher.close") : t("ai.launcher.open")}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      icon={isOpen ? <X size={24} /> : <Sparkles size={24} />}
      onClick={onToggle}
      className="fixed! bottom-6 end-6 z-50 h-14! w-14! shadow-lg! transition-transform hover:scale-105 focus-visible:scale-105 max-[650px]:bottom-4 max-[650px]:end-4"
    />
  );
};

export default AiAssistantLauncher;
