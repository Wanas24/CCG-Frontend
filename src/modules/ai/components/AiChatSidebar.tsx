import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Plus, Sparkles } from "lucide-react";
import { AppButton, AppSkeleton } from "@/shared/ANTD_UIComponents";
import { useGetAiChats } from "../api/hooks/useGetAiChats";
import AiUsagePanel from "./AiUsagePanel";
import {
  groupAiChatsByUpdatedAt,
  type TAiChatGroupKey,
} from "../utils/groupAiChatsByUpdatedAt";

type Props = {
  className?: string;
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
};

const groupLabelKey: Record<
  TAiChatGroupKey,
  "ai.sidebar.today" | "ai.sidebar.yesterday" | "ai.sidebar.older"
> = {
  today: "ai.sidebar.today",
  yesterday: "ai.sidebar.yesterday",
  older: "ai.sidebar.older",
};

const AiChatSidebar = ({
  className,
  activeChatId,
  onSelectChat,
  onNewChat,
}: Props) => {
  const { t } = useTranslation();
  const { data, isPending, isError } = useGetAiChats();

  const chats =
    data?.isSuccess && Array.isArray(data.data) ? data.data : [];
  const groups = groupAiChatsByUpdatedAt(chats);
  const showError = isError || (data !== undefined && !data.isSuccess);

  return (
    <aside
      className={clsx(
        "flex h-full min-h-0 w-70 shrink-0 flex-col border-e border-(--Grey300) bg-(--Grey100)",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 px-3 pt-3 text-(--app-text)">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--Primary100) text-(--Primary400)">
          <Sparkles size={18} aria-hidden="true" />
        </span>
        <p className="m-0 text-sm font-semibold">{t("ai.title")}</p>
      </div>

      <nav
        aria-label={t("ai.sidebar.conversations")}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3"
      >
        {isPending && (
          <div className="flex flex-col gap-3" aria-busy="true">
            {Array.from({ length: 2 }).map((_, groupIndex) => (
              <div key={groupIndex} className="flex flex-col gap-1">
                <AppSkeleton.Input
                  active
                  className="!mb-1 !h-3 !w-16 !min-w-16"
                />
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="rounded-lg px-2 py-2"
                  >
                    <AppSkeleton.Input
                      active
                      block
                      className="!h-4 !w-full !min-w-0"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {!isPending && showError && (
          <p className="m-0 text-sm text-(--statusR200)">
            {t("ai.sidebar.loadError")}
          </p>
        )}

        {!isPending && !showError && chats.length === 0 && (
          <p className="m-0 text-sm text-(--Grey600)">{t("ai.sidebar.empty")}</p>
        )}

        {!isPending &&
          !showError &&
          groups.map((group) => (
            <div key={group.key} className="flex flex-col gap-1">
              <p className="m-0 px-1 text-xs font-medium uppercase text-(--Grey600)">
                {t(groupLabelKey[group.key])}
              </p>
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {group.chats.map((chat) => {
                  const isActive = chat.id === activeChatId;

                  return (
                    <li key={chat.id}>
                      <button
                        type="button"
                        aria-current={isActive ? "true" : undefined}
                        aria-label={chat.title}
                        onClick={() => onSelectChat(chat.id)}
                        className={clsx(
                          "w-full truncate rounded-lg px-2 py-2 text-start text-sm transition-colors",
                          isActive
                            ? "bg-(--Primary100) font-medium text-(--Primary400)"
                            : "text-(--app-text) hover:bg-(--Grey200)",
                        )}
                      >
                        {chat.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </nav>

      <div className="flex shrink-0 flex-col border-t border-(--Grey300)">
        <div className="px-3 pt-2 pb-1">
          <AppButton
            block
            size="small"
            icon={<Plus size={16} />}
            onClick={onNewChat}
            className="h-8! text-xs! font-medium"
          >
            {t("ai.sidebar.newChat")}
          </AppButton>
        </div>

        <AiUsagePanel layout="footer" />
      </div>
    </aside>
  );
};

export default AiChatSidebar;
