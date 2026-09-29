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
import { flattenAiMessagePages } from "../utils/flattenAiMessagePages";

type Props = {
  activeChatId: string | null;
};

const SCROLL_LOAD_THRESHOLD_PX = 48;

const AiMessages = ({ activeChatId }: Props) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToBottomRef = useRef(false);
  const previousChatIdRef = useRef<string | null>(null);
  const restoreScrollRef = useRef<{
    height: number;
    top: number;
  } | null>(null);

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetAiMessages(activeChatId);

  const messages = flattenAiMessagePages(data?.pages);
  const showError =
    isError ||
    Boolean(data?.pages.some((page) => page !== undefined && !page.isSuccess));

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
    if (!container || !activeChatId) {
      return;
    }

    if (shouldScrollToBottomRef.current && !isPending && !showError) {
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
  }, [activeChatId, isPending, isFetchingNextPage, messages, showError]);

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

  if (!activeChatId) {
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

  if (isPending) {
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

  if (showError) {
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

      {messages.map((message) => {
        const isUser = message.role.toLowerCase() === "user";
        const isAssistant = message.role.toLowerCase() === "assistant";

        return (
          <div
            key={message.id}
            className={clsx(
              "flex w-full",
              isUser ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={clsx(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words",
                isUser
                  ? "rounded-ee-md bg-(--Primary400) text-(--app-surface)"
                  : isAssistant
                    ? "rounded-es-md bg-(--Grey200) text-(--app-text)"
                    : "rounded-es-md border border-(--Grey300) bg-(--app-surface) text-(--app-text)",
              )}
            >
              {message.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AiMessages;
