import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Plus, Sparkles } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";

type Props = {
  className?: string;
};

const AiChatSidebar = ({ className }: Props) => {
  const { t } = useTranslation();

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

      <AppButton block icon={<Plus size={18} />} disabled>
        {t("ai.sidebar.newChat")}
      </AppButton>

      <nav
        aria-label={t("ai.sidebar.conversations")}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto"
      >
        <p className="m-0 text-xs font-medium uppercase text-(--Grey600)">
          {t("ai.sidebar.conversations")}
        </p>
        <p className="m-0 text-sm text-(--Grey600)">
          {t("ai.sidebar.emptyList")}
        </p>
      </nav>
    </aside>
  );
};

export default AiChatSidebar;
