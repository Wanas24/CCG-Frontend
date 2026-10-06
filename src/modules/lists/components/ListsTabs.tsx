import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { LISTS_TABS, type ListsTabId } from "../listsTabs";

type Props = {
  value: ListsTabId;
  onChange: (value: ListsTabId) => void;
  className?: string;
};

const ListsTabs = ({ value, onChange, className }: Props) => {
  const { t } = useTranslation();

  return (
    <nav
      className={clsx(
        "inline-flex w-fit max-w-full flex-wrap items-center gap-1 self-start rounded-2xl border border-(--Grey300) bg-(--Grey100) p-1",
        className,
      )}
      aria-label={t("lists.title")}
    >
      {LISTS_TABS.map((tab) => {
        const Icon = tab.icon;
        const active = value === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            aria-current={active ? "page" : undefined}
            className={clsx(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition",
              active
                ? "bg-linear-to-r from-(--Primary400) to-(--Secondary300) text-(--app-surface) shadow-sm"
                : "text-(--Grey600) hover:bg-(--app-surface) hover:text-(--app-text)",
            )}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={16} className="shrink-0 opacity-90" aria-hidden />
            <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default ListsTabs;
