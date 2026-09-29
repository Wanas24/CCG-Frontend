import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Plus, Sparkles } from "lucide-react";
import { AppButton, AppSkeleton } from "@/shared/ANTD_UIComponents";
import { useGetAiChats } from "../api/hooks/useGetAiChats";
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
        "flex w-62 shrink-0 flex-col gap-4 border-e border-(--Grey300) bg-(--Grey100) p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-(--app-text)">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--Primary100) text-(--Primary400)">
          <Sparkles size={18} aria-hidden="true" />
        </span>
        <p className="m-0 text-base font-semibold">{t("ai.title")}</p>
      </div>

      <AppButton block icon={<Plus size={18} />} onClick={onNewChat}>
        {t("ai.sidebar.newChat")}
      </AppButton>

      <nav
        aria-label={t("ai.sidebar.conversations")}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
      >
        {isPending && (
          <div className="flex flex-col gap-2" aria-busy="true">
            <p className="m-0 text-sm text-(--Grey600)">
              {t("ai.sidebar.loading")}
            </p>
            <AppSkeleton active paragraph={{ rows: 4 }} title={false} />
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
    </aside>
  );
};

export default AiChatSidebar;
