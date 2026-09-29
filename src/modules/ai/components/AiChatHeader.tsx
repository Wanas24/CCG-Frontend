import { useTranslation } from "react-i18next";
import { Gauge, MessageSquare, X } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";

type Props = {
  conversationTitle: string | null;
  onOpenChats: () => void;
  onOpenUsage: () => void;
  onClose: () => void;
};

const iconButtonClassName = "shrink-0 hover:bg-(--Grey200)!";

const AiChatHeader = ({
  conversationTitle,
  onOpenChats,
  onOpenUsage,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <header className="flex items-center gap-2 border-b border-(--Grey300) px-4 py-3 max-[650px]:px-2">
      <div className="flex min-[651px]:hidden">
        <AppButton
          variant="default"
          aria-label={t("ai.chat.openChats")}
          icon={<MessageSquare size={20} />}
          onClick={onOpenChats}
          className={iconButtonClassName}
        />
      </div>

      <div className="min-w-0 flex-1 max-[650px]:text-center">
        <h2 className="m-0 truncate text-base font-semibold text-(--app-text)">
          {t("ai.title")}
        </h2>
        <p className="m-0 truncate text-xs text-(--Grey600)">
          {conversationTitle ?? t("ai.chat.newConversation")}
        </p>
      </div>

      <div className="flex min-[901px]:hidden">
        <AppButton
          variant="default"
          aria-label={t("ai.chat.openUsage")}
          icon={<Gauge size={20} />}
          onClick={onOpenUsage}
          className={iconButtonClassName}
        />
      </div>

      <AppButton
        variant="default"
        aria-label={t("ai.panel.close")}
        icon={<X size={20} />}
        onClick={onClose}
        className={iconButtonClassName}
      />
    </header>
  );
};

export default AiChatHeader;
