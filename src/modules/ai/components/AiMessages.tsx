import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type UIEvent,
} from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Sparkles } from "lucide-react";
import { AppSkeleton } from "@/shared/ANTD_UIComponents";
import { useGetAiMessages } from "../api/hooks/useGetAiMessages";
import type { TAiAssistantUiMeta, TAiUiMessage } from "../types";
import { flattenAiMessagePages } from "../utils/flattenAiMessagePages";
import { createAiAssistantMetaKey } from "../utils/aiResponseMeta";
import AiArtifacts from "./AiArtifacts";
import AiLocalMediaPreview from "./AiLocalMediaPreview";
import AiMarkdown from "./AiMarkdown";
import AiSources from "./AiSources";
import AiToolUsage from "./AiToolUsage";
import AiWarnings from "./AiWarnings";

const isSameMessageContent = (
  leftRole: string,
  leftContent: string,
  rightRole: string,
  rightContent: string,
) =>
  leftRole.toLowerCase() === rightRole.toLowerCase() &&
  leftContent === rightContent;

type Props = {
  activeChatId: string | null;
  localMessages: TAiUiMessage[];
  isWaitingForAssistant: boolean;
  sendError: boolean;
  assistantMetaByKey?: Record<string, TAiAssistantUiMeta>;
};

const SCROLL_LOAD_THRESHOLD_PX = 48;

const MessageBubble = ({
  role,
  content,
  isError,
  usedTools,
  selectedToolGroups,
  warnings,
  sources,
  artifacts,
  transcript,
  localAttachments,
  localAudio,
}: TAiUiMessage) => {
  const { t } = useTranslation();
  const normalizedRole = role.toLowerCase();
  const isUser = normalizedRole === "user";
  const isAssistant = normalizedRole === "assistant";

  return (
    <div
      className={clsx("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={clsx(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm break-words",
          isUser
            ? "whitespace-pre-wrap rounded-ee-md bg-(--Primary400) text-(--app-surface)"
            : isAssistant
              ? "rounded-es-md bg-(--Grey200) text-(--app-text)"
              : "whitespace-pre-wrap rounded-es-md border border-(--Grey300) bg-(--app-surface) text-(--app-text)",
          isError && "ring-1 ring-(--statusR200)",
        )}
      >
        {isAssistant ? (
          <AiMarkdown content={content} />
        ) : content ? (
          content
        ) : (
          <span className="opacity-80">
            {localAudio
              ? t("ai.composer.voiceMessage")
              : t("ai.composer.attachmentMessage")}
          </span>
        )}

        {isUser && (
          <AiLocalMediaPreview
            attachments={localAttachments}
            audio={localAudio}
          />
        )}

        {isAssistant && transcript ? (
          <p className="m-0 mt-1.5 border-t border-(--Grey300)/60 pt-1.5 text-[0.7rem] text-(--Grey700)">
            <span className="font-medium">{t("ai.response.transcript")}: </span>
            <span className="break-words">{transcript}</span>
          </p>
        ) : null}

        {isAssistant && (
          <div className="mt-0.5 min-w-0">
            <AiToolUsage
              usedTools={usedTools}
              selectedToolGroups={selectedToolGroups}
            />
            <AiWarnings warnings={warnings} />
            <AiSources sources={sources} />
            <AiArtifacts artifacts={artifacts} />
          </div>
        )}
      </div>
    </div>
  );
};

const AiMessages = ({
  activeChatId,
  localMessages,
  isWaitingForAssistant,
  sendError,
  assistantMetaByKey = {},
}: Props) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToBottomRef = useRef(false);
  const previousChatIdRef = useRef<string | null>(null);
  const restoreScrollRef = useRef<{
    height: number;
    top: number;
  } | null>(null);
  const previousLocalCountRef = useRef(0);

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetAiMessages(activeChatId);

  const historyMessages = flattenAiMessagePages(data?.pages);
  const visibleLocalMessages = useMemo(
    () =>
      localMessages.filter(
        (local) =>
          !historyMessages.some((history) =>
            isSameMessageContent(
              history.role,
              history.content,
              local.role,
              local.content,
            ),
          ),
      ),
    [historyMessages, localMessages],
  );
  const showHistoryError =
    isError ||
    Boolean(data?.pages.some((page) => page !== undefined && !page.isSuccess));
  const hasLocalContent =
    visibleLocalMessages.length > 0 || isWaitingForAssistant || sendError;
  const showEmptyState = !activeChatId && !hasLocalContent;

  useEffect(() => {
    if (activeChatId === previousChatIdRef.current) {
      return;
    }

    previousChatIdRef.current = activeChatId;
    shouldScrollToBottomRef.current = Boolean(activeChatId);
    restoreScrollRef.current = null;
  }, [activeChatId]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const localCountChanged =
      visibleLocalMessages.length !== previousLocalCountRef.current ||
      isWaitingForAssistant;
    previousLocalCountRef.current = visibleLocalMessages.length;

    if (localCountChanged && hasLocalContent) {
      container.scrollTop = container.scrollHeight;
      return;
    }

    if (!activeChatId) {
      return;
    }

    if (shouldScrollToBottomRef.current && !isPending && !showHistoryError) {
      container.scrollTop = container.scrollHeight;
      shouldScrollToBottomRef.current = false;
      return;
    }

    const restore = restoreScrollRef.current;
    if (restore && !isFetchingNextPage) {
      container.scrollTop =
        container.scrollHeight - restore.height + restore.top;
      restoreScrollRef.current = null;
    }
  }, [
    activeChatId,
    hasLocalContent,
    isPending,
    isFetchingNextPage,
    isWaitingForAssistant,
    historyMessages,
    visibleLocalMessages,
    showHistoryError,
  ]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!activeChatId || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const container = event.currentTarget;
    if (container.scrollTop > SCROLL_LOAD_THRESHOLD_PX) {
      return;
    }

    restoreScrollRef.current = {
      height: container.scrollHeight,
      top: container.scrollTop,
    };
    void fetchNextPage();
  };

  if (showEmptyState) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto p-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--Primary100) text-(--Primary400)">
          <Sparkles size={24} aria-hidden="true" />
        </span>
        <p className="m-0 text-sm font-medium text-(--Grey600)">
          {t("ai.title")}
        </p>
        <h3 className="m-0 text-lg font-semibold text-(--app-text)">
          {t("ai.chat.emptyTitle")}
        </h3>
      </div>
    );
  }

  if (activeChatId && isPending && !hasLocalContent) {
    return (
      <div
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4"
        aria-busy="true"
      >
        <p className="m-0 text-sm text-(--Grey600)">
          {t("ai.chat.loadingMessages")}
        </p>
        <AppSkeleton active paragraph={{ rows: 6 }} title={false} />
      </div>
    );
  }

  if (activeChatId && showHistoryError && !hasLocalContent) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-6 text-center">
        <p className="m-0 text-sm text-(--statusR200)">
          {t("ai.chat.loadMessagesError")}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4"
    >
      {isFetchingNextPage && (
        <p className="m-0 text-center text-xs text-(--Grey600)">
          {t("ai.chat.loadingOlder")}
        </p>
      )}

      {historyMessages.map((message) => {
        const meta =
          activeChatId && message.role.toLowerCase() === "assistant"
            ? assistantMetaByKey[
                createAiAssistantMetaKey(activeChatId, message.content)
              ]
            : undefined;

        return (
          <MessageBubble
            key={`history-${message.id}`}
            id={`history-${message.id}`}
            role={message.role === "user" ? "user" : "assistant"}
            content={message.content}
            usedTools={meta?.usedTools}
            selectedToolGroups={meta?.selectedToolGroups}
            warnings={meta?.warnings}
            sources={meta?.sources}
            artifacts={meta?.artifacts}
            transcript={meta?.transcript}
          />
        );
      })}

      {visibleLocalMessages.map((message) => (
        <MessageBubble key={message.id} {...message} />
      ))}

      {isWaitingForAssistant && (
        <div className="flex w-full justify-start" aria-live="polite">
          <div className="rounded-2xl rounded-es-md bg-(--Grey200) px-3 py-2 text-sm text-(--Grey600)">
            {t("ai.chat.thinking")}
          </div>
        </div>
      )}

      {sendError && (
        <p className="m-0 text-center text-xs text-(--statusR200)">
          {t("ai.chat.sendError")}
        </p>
      )}
    </div>
  );
};

export default AiMessages;
