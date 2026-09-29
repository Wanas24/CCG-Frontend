import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useLocale } from "@/i18n";
import { queryClient } from "@/lib/queryClient";
import { AppDrawer } from "@/shared/ANTD_UIComponents";
import { useGetAiChats } from "../api/hooks/useGetAiChats";
import { useSendAiChat } from "../api/hooks/useSendAiChat";
import {
  aiChatsQueryKey,
  aiMessagesQueryKey,
} from "../api/queryKeys/aiQueryKeys";
import type { TAiUiMessage } from "../types";
import { createAiAssistantMetaKey } from "../utils/aiResponseMeta";
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

const createLocalMessageId = (role: "user" | "assistant") =>
  `local-${role}-${crypto.randomUUID()}`;

const isAbortError = (error: unknown) => {
  if (axios.isCancel(error)) {
    return true;
  }

  if (!axios.isAxiosError(error)) {
    return false;
  }

  return (
    error.code === "ERR_CANCELED" ||
    error.name === "CanceledError" ||
    error.name === "AbortError"
  );
};

const AiAssistantPanel = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<TAiUiMessage[]>([]);
  const [isWaitingForAssistant, setIsWaitingForAssistant] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [assistantMetaByKey, setAssistantMetaByKey] = useState<
    Record<
      string,
      {
        usedTools?: string[];
        selectedToolGroups?: string[];
        warnings?: string[];
      }
    >
  >({});

  const abortControllerRef = useRef<AbortController | null>(null);
  const isSendingRef = useRef(false);

  const { mutateAsync: sendAiChat, isPending: isSendMutationPending } =
    useSendAiChat();

  const { data: chatsResult } = useGetAiChats();
  const chats =
    chatsResult?.isSuccess && Array.isArray(chatsResult.data)
      ? chatsResult.data
      : [];
  const activeChatTitle =
    chats.find((chat) => chat.id === activeChatId)?.title ?? null;

  const isSending = isSendMutationPending || isWaitingForAssistant;

  const resetLocalConversation = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    isSendingRef.current = false;
    setLocalMessages([]);
    setIsWaitingForAssistant(false);
    setSendError(false);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSelectChat = (chatId: string) => {
    resetLocalConversation();
    setActiveChatId(chatId);
    setIsChatSidebarOpen(false);
  };

  const handleNewChat = () => {
    resetLocalConversation();
    setActiveChatId(null);
    setIsChatSidebarOpen(false);
  };

  const handleSend = async (message: string) => {
    if (isSendingRef.current || isSending) {
      return { ok: false, restoreMessage: message };
    }

    isSendingRef.current = true;
    setSendError(false);
    setLocalMessages((current) => [
      ...current,
      {
        id: createLocalMessageId("user"),
        role: "user",
        content: message,
      },
    ]);
    setIsWaitingForAssistant(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await sendAiChat({
        message,
        ...(activeChatId ? { chatId: activeChatId } : {}),
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        return { ok: false, aborted: true };
      }

      if (!response.isSuccess || !response.data) {
        setIsWaitingForAssistant(false);
        setSendError(true);
        setLocalMessages((current) =>
          current.map((item, index) =>
            index === current.length - 1 && item.role === "user"
              ? { ...item, isError: true }
              : item,
          ),
        );
        return { ok: false, restoreMessage: message };
      }

      const { chatId, answer, usedTools, selectedToolGroups, warnings } =
        response.data;
      const responseMeta = {
        usedTools,
        selectedToolGroups,
        warnings,
      };

      setLocalMessages((current) => [
        ...current,
        {
          id: createLocalMessageId("assistant"),
          role: "assistant",
          content: answer,
          ...responseMeta,
        },
      ]);
      setIsWaitingForAssistant(false);
      setActiveChatId(chatId);
      setAssistantMetaByKey((current) => ({
        ...current,
        [createAiAssistantMetaKey(chatId, answer)]: responseMeta,
      }));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: aiChatsQueryKey }),
        queryClient.invalidateQueries({
          queryKey: aiMessagesQueryKey(chatId),
        }),
      ]);

      if (!controller.signal.aborted) {
        setLocalMessages([]);
        setSendError(false);
      }

      return { ok: true };
    } catch (error) {
      if (controller.signal.aborted || isAbortError(error)) {
        return { ok: false, aborted: true };
      }

      setIsWaitingForAssistant(false);
      setSendError(true);
      setLocalMessages((current) =>
        current.map((item, index) =>
          index === current.length - 1 && item.role === "user"
            ? { ...item, isError: true }
            : item,
        ),
      );
      return { ok: false, restoreMessage: message };
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      isSendingRef.current = false;
    }
  };

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
      <AiChatSidebar
        className="max-[650px]:hidden"
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AiChatHeader
          conversationTitle={activeChatTitle}
          onOpenChats={() => setIsChatSidebarOpen(true)}
          onOpenUsage={() => setIsUsageOpen(true)}
          onClose={onClose}
        />
        <AiMessages
          activeChatId={activeChatId}
          localMessages={localMessages}
          isWaitingForAssistant={isWaitingForAssistant}
          sendError={sendError}
          assistantMetaByKey={assistantMetaByKey}
        />
        <AiComposer isSending={isSending} onSend={handleSend} />
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
        <AiChatSidebar
          className={embeddedPanelClassName}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
        />
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
