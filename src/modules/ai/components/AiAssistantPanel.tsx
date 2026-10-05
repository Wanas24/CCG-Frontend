import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useLocale } from "@/i18n";
import { queryClient } from "@/lib/queryClient";
import { AppDrawer } from "@/shared/ANTD_UIComponents";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { useGetAiChats } from "../api/hooks/useGetAiChats";
import { useSendAiChat } from "../api/hooks/useSendAiChat";
import {
  aiChatsQueryKey,
  aiMessagesQueryKey,
  aiUsageQueryKey,
} from "../api/queryKeys/aiQueryKeys";
import type {
  TAiAssistantUiMeta,
  TAiComposerSendPayload,
  TAiUiMessage,
} from "../types";
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
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<TAiUiMessage[]>([]);
  const [isWaitingForAssistant, setIsWaitingForAssistant] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [assistantMetaByKey, setAssistantMetaByKey] = useState<
    Record<string, TAiAssistantUiMeta>
  >({});

  const abortControllerRef = useRef<AbortController | null>(null);
  const isSendingRef = useRef(false);
  const pendingUserMessageIdRef = useRef<string | null>(null);

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
    pendingUserMessageIdRef.current = null;
    setLocalMessages([]);
    setIsWaitingForAssistant(false);
    setSendError(false);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const removePendingUserMessage = () => {
    const pendingId = pendingUserMessageIdRef.current;
    if (!pendingId) {
      return;
    }

    setLocalMessages((current) =>
      current.filter((message) => message.id !== pendingId),
    );
    pendingUserMessageIdRef.current = null;
  };

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

  const handleCancelSend = () => {
    abortControllerRef.current?.abort();
  };

  const handleSend = async (payload: TAiComposerSendPayload) => {
    if (!companyId || isSendingRef.current || isSending) {
      return { ok: false, restore: payload };
    }

    const message = payload.message.trim();
    const audio = payload.audio ?? null;
    const attachments = payload.attachments ?? [];

    if (!message && !audio) {
      return { ok: false, restore: payload };
    }

    isSendingRef.current = true;
    setSendError(false);

    const userMessageId = createLocalMessageId("user");
    pendingUserMessageIdRef.current = userMessageId;

    setLocalMessages((current) => [
      ...current,
      {
        id: userMessageId,
        role: "user",
        content: message,
        localAttachments: attachments.map((file) => ({
          id: crypto.randomUUID(),
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          file,
        })),
        localAudio: audio
          ? {
              fileName: audio.name,
              contentType: audio.type,
              size: audio.size,
              file: audio,
            }
          : null,
      },
    ]);
    setIsWaitingForAssistant(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await sendAiChat({
        ...(message ? { message } : {}),
        ...(audio ? { audio } : {}),
        ...(attachments.length > 0 ? { attachments } : {}),
        ...(activeChatId ? { chatId: activeChatId } : {}),
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        setIsWaitingForAssistant(false);
        removePendingUserMessage();
        return { ok: false, aborted: true, restore: payload };
      }

      if (!response.isSuccess || !response.data) {
        setIsWaitingForAssistant(false);
        setSendError(true);
        setLocalMessages((current) =>
          current.map((item) =>
            item.id === userMessageId ? { ...item, isError: true } : item,
          ),
        );
        return { ok: false, restore: payload };
      }

      const {
        chatId,
        answer,
        usedTools,
        selectedToolGroups,
        warnings,
        sources,
        artifacts,
        transcript,
      } = response.data;
      const responseMeta: TAiAssistantUiMeta = {
        usedTools,
        selectedToolGroups,
        warnings,
        sources,
        artifacts,
        transcript,
      };

      setLocalMessages((current) => [
        ...current.map((item) =>
          item.id === userMessageId && transcript
            ? { ...item, content: transcript }
            : item,
        ),
        {
          id: createLocalMessageId("assistant"),
          role: "assistant",
          content: answer,
          ...responseMeta,
        },
      ]);
      setIsWaitingForAssistant(false);
      setActiveChatId(chatId);
      pendingUserMessageIdRef.current = null;
      setAssistantMetaByKey((current) => ({
        ...current,
        [createAiAssistantMetaKey(chatId, answer)]: responseMeta,
      }));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: aiChatsQueryKey }),
        queryClient.invalidateQueries({
          queryKey: aiMessagesQueryKey(chatId),
        }),
        queryClient.invalidateQueries({ queryKey: aiUsageQueryKey }),
      ]);

      if (!controller.signal.aborted) {
        setLocalMessages([]);
        setSendError(false);
      }

      return { ok: true };
    } catch (error) {
      if (controller.signal.aborted || isAbortError(error)) {
        setIsWaitingForAssistant(false);
        setSendError(false);
        removePendingUserMessage();
        return { ok: false, aborted: true, restore: payload };
      }

      setIsWaitingForAssistant(false);
      setSendError(true);
      setLocalMessages((current) =>
        current.map((item) =>
          item.id === userMessageId ? { ...item, isError: true } : item,
        ),
      );
      return { ok: false, restore: payload };
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
      className="fixed bottom-24 end-6 z-50 flex h-[min(44rem,calc(100dvh-8rem))] w-[min(76rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-(--Grey300) bg-(--app-surface) text-(--app-text) shadow-2xl max-[650px]:start-3 max-[650px]:end-3 max-[650px]:top-3 max-[650px]:bottom-22 max-[650px]:h-auto max-[650px]:w-auto"
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
        <AiComposer
          isSending={isSending}
          onSend={handleSend}
          onCancel={handleCancelSend}
        />
      </div>

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
        rootClassName="min-[651px]:hidden"
      >
        <AiUsagePanel className={embeddedPanelClassName} />
      </AppDrawer>
    </section>
  );
};

export default AiAssistantPanel;
