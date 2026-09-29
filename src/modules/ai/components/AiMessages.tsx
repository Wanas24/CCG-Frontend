import {
  useEffect,
  useLayoutEffect,
  useRef,
  type UIEvent,
} from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Sparkles } from "lucide-react";
import { AppSkeleton } from "@/shared/ANTD_UIComponents";
import { useGetAiMessages } from "../api/hooks/useGetAiMessages";
import type { TAiUiMessage } from "../types";
import { flattenAiMessagePages } from "../utils/flattenAiMessagePages";

type Props = {
  activeChatId: string | null;
  localMessages: TAiUiMessage[];
  isWaitingForAssistant: boolean;
  sendError: boolean;
};

const SCROLL_LOAD_THRESHOLD_PX = 48;

const MessageBubble = ({
  role,
  content,
  isError,
}: {
  role: string;
  content: string;
  isError?: boolean;
}) => {
  const normalizedRole = role.toLowerCase();
  const isUser = normalizedRole === "user";
  const isAssistant = normalizedRole === "assistant";

  return (
    <div
      className={clsx("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={clsx(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words",
          isUser
            ? "rounded-ee-md bg-(--Primary400) text-(--app-surface)"
            : isAssistant
              ? "rounded-es-md bg-(--Grey200) text-(--app-text)"
              : "rounded-es-md border border-(--Grey300) bg-(--app-surface) text-(--app-text)",
          isError && "ring-1 ring-(--statusR200)",
        )}
      >
        {content}
      </div>
    </div>
  );
};

const AiMessages = ({
  activeChatId,
  localMessages,
  isWaitingForAssistant,
  sendError,
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
  const showHistoryError =
    isError ||
    Boolean(data?.pages.some((page) => page !== undefined && !page.isSuccess));
  const hasLocalContent =
    localMessages.length > 0 || isWaitingForAssistant || sendError;
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
      localMessages.length !== previousLocalCountRef.current ||
      isWaitingForAssistant;
    previousLocalCountRef.current = localMessages.length;

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
    localMessages,
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

      {historyMessages.map((message) => (
        <MessageBubble
          key={`history-${message.id}`}
          role={message.role}
          content={message.content}
        />
      ))}

      {localMessages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          isError={message.isError}
        />
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
