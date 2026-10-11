import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { queryClient } from "@/lib/queryClient";
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

type SendResult = {
  ok: boolean;
  restore?: TAiComposerSendPayload;
  aborted?: boolean;
};

export const useAiAssistantSession = () => {
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
  const activeChatIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  const { mutateAsync: sendAiChat, isPending: isSendMutationPending } =
    useSendAiChat();

  const isSending = isSendMutationPending || isWaitingForAssistant;

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      isSendingRef.current = false;
      pendingUserMessageIdRef.current = null;
    };
  }, []);

  const removePendingUserMessage = useCallback(() => {
    const pendingId = pendingUserMessageIdRef.current;
    if (!pendingId) {
      return;
    }

    setLocalMessages((current) =>
      current.filter((message) => message.id !== pendingId),
    );
    pendingUserMessageIdRef.current = null;
  }, []);

  const resetLocalConversation = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    isSendingRef.current = false;
    pendingUserMessageIdRef.current = null;
    setLocalMessages([]);
    setIsWaitingForAssistant(false);
    setSendError(false);
  }, []);

  const selectChat = useCallback(
    (chatId: string) => {
      resetLocalConversation();
      setActiveChatId(chatId);
    },
    [resetLocalConversation],
  );

  const startNewChat = useCallback(() => {
    resetLocalConversation();
    setActiveChatId(null);
  }, [resetLocalConversation]);

  const cancelSend = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (payload: TAiComposerSendPayload): Promise<SendResult> => {
      if (isSendingRef.current || isSending) {
        return { ok: false, restore: payload };
      }

      const message = payload.message.trim();
      const audio = payload.audio ?? null;
      const attachments = payload.attachments ?? [];

      if (!message && !audio) {
        return { ok: false, restore: payload };
      }

      const requestChatId = activeChatIdRef.current;
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

      const belongsToCurrentChat = () =>
        activeChatIdRef.current === requestChatId;

      try {
        const response = await sendAiChat({
          ...(message ? { message } : {}),
          ...(audio ? { audio } : {}),
          ...(attachments.length > 0 ? { attachments } : {}),
          ...(requestChatId ? { chatId: requestChatId } : {}),
          signal: controller.signal,
        });

        if (!mountedRef.current) {
          return { ok: false };
        }

        if (controller.signal.aborted) {
          if (belongsToCurrentChat()) {
            setIsWaitingForAssistant(false);
            removePendingUserMessage();
          }
          return { ok: false, aborted: true, restore: payload };
        }

        if (!response.isSuccess || !response.data) {
          if (belongsToCurrentChat()) {
            setIsWaitingForAssistant(false);
            setSendError(true);
            setLocalMessages((current) =>
              current.map((item) =>
                item.id === userMessageId ? { ...item, isError: true } : item,
              ),
            );
          }
          return { ok: false, restore: payload };
        }

        if (
          activeChatIdRef.current !== requestChatId &&
          activeChatIdRef.current !== null
        ) {
          return { ok: false };
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
            refetchType: "all",
          }),
          queryClient.invalidateQueries({ queryKey: aiUsageQueryKey }),
        ]);

        if (mountedRef.current && !controller.signal.aborted) {
          setLocalMessages([]);
          setSendError(false);
        }

        return { ok: true };
      } catch (error) {
        if (!mountedRef.current) {
          return { ok: false };
        }

        if (controller.signal.aborted || isAbortError(error)) {
          if (belongsToCurrentChat()) {
            setIsWaitingForAssistant(false);
            setSendError(false);
            removePendingUserMessage();
          }
          return { ok: false, aborted: true, restore: payload };
        }

        if (belongsToCurrentChat()) {
          setIsWaitingForAssistant(false);
          setSendError(true);
          setLocalMessages((current) =>
            current.map((item) =>
              item.id === userMessageId ? { ...item, isError: true } : item,
            ),
          );
        }
        return { ok: false, restore: payload };
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
        isSendingRef.current = false;
      }
    },
    [isSending, removePendingUserMessage, sendAiChat],
  );

  return {
    activeChatId,
    localMessages,
    isWaitingForAssistant,
    sendError,
    assistantMetaByKey,
    isSending,
    selectChat,
    startNewChat,
    cancelSend,
    sendMessage,
  };
};

export type AiAssistantSession = ReturnType<typeof useAiAssistantSession>;
