import { useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/i18n";
import { AppDrawer } from "@/shared/ANTD_UIComponents";
import AiChatHeader from "./AiChatHeader";
import AiChatSidebar from "./AiChatSidebar";
import AiComposer from "./AiComposer";
import AiMessages from "./AiMessages";
import AiUsagePanel from "./AiUsagePanel";

type Props = {
  onClose: () => void;
};

const sharedDrawerProps = {
  size: 280,
  getContainer: false,
  destroyOnHidden: true,
  classNames: { body: "flex! flex-col p-0!" },
} as const;

const embeddedPanelClassName = "min-h-0 w-full! flex-1 border-0!";

const AiAssistantPanel = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && !isChatSidebarOpen && !isUsageOpen) {
      onClose();
    }
  };

  return (
    <section
      role="dialog"
      aria-label={t("ai.title")}
      onKeyDown={handleKeyDown}
      className="fixed bottom-24 end-6 z-50 flex h-[min(44rem,calc(100dvh-8rem))] w-[min(68rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-(--Grey300) bg-(--app-surface) text-(--app-text) shadow-2xl max-[650px]:start-3 max-[650px]:end-3 max-[650px]:top-3 max-[650px]:bottom-22 max-[650px]:h-auto max-[650px]:w-auto"
    >
      <AiChatSidebar className="max-[650px]:hidden" />

      <div className="flex min-w-0 flex-1 flex-col">
        <AiChatHeader
          onOpenChats={() => setIsChatSidebarOpen(true)}
          onOpenUsage={() => setIsUsageOpen(true)}
          onClose={onClose}
        />
        <AiMessages />
        <AiComposer />
      </div>

      <AiUsagePanel className="max-[900px]:hidden" />

      <AppDrawer
        {...sharedDrawerProps}
        open={isChatSidebarOpen}
        onClose={() => setIsChatSidebarOpen(false)}
        placement={isRtl ? "right" : "left"}
        title={t("ai.sidebar.conversations")}
        rootClassName="min-[651px]:hidden"
      >
        <AiChatSidebar className={embeddedPanelClassName} />
      </AppDrawer>

      <AppDrawer
        {...sharedDrawerProps}
        open={isUsageOpen}
        onClose={() => setIsUsageOpen(false)}
        placement={isRtl ? "left" : "right"}
        title={t("ai.usage.title")}
        rootClassName="min-[901px]:hidden"
      >
        <AiUsagePanel className={embeddedPanelClassName} />
      </AppDrawer>
    </section>
  );
};

export default AiAssistantPanel;
