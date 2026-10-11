import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { typeHue } from "../../utils/listColors";
import type { TItemCategory } from "../types/itemCategory";

type Props = {
  item: TItemCategory;
  canDelete: boolean;
  onOpen: (item: TItemCategory) => void;
  onDelete: (item: TItemCategory) => void;
};

const ItemCategoryCard = ({ item, canDelete, onOpen, onDelete }: Props) => {
  const { t } = useTranslation();
  const hue = typeHue(item.type);

  return (
    <article
      className={clsx(
        "relative min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-(--Grey300) bg-(--app-surface) p-3 text-start transition",
        "hover:-translate-y-0.5 hover:border-(--Grey400)",
      )}
      style={{
        backgroundImage: `linear-gradient(180deg, hsl(${hue} 70% 60% / 0.12), transparent 50%)`,
      }}
      onClick={() => onOpen(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(item);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, hsl(${hue} 80% 60%), hsl(${(hue + 40) % 360} 80% 58%))`,
        }}
      />
      <div className="flex items-start gap-1.5">
        <h3
          className="m-0 min-w-0 flex-1 truncate text-xs font-semibold text-(--app-text) sm:text-sm"
          dir="auto"
        >
          {item.name}
        </h3>
        {canDelete ? (
          <AppButton
            variant="delete"
            padding="none"
            className="size-7! shrink-0"
            aria-label={t("lists.itemCatalog.deleteTitle")}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(item);
            }}
          />
        ) : null}
      </div>
      {item.description ? (
        <p
          className="mt-1.5 mb-0 line-clamp-2 text-[11px] text-(--Grey600) sm:text-xs"
          dir="auto"
        >
          {item.description}
        </p>
      ) : null}
      {item.notes ? (
        <p
          className="mt-1.5 mb-0 line-clamp-1 text-[11px] text-(--Grey500) sm:line-clamp-2 sm:text-xs"
          dir="auto"
        >
          {item.notes}
        </p>
      ) : null}
      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5">
        {item.unit ? (
          <span className="max-w-full truncate rounded-full border border-(--Grey300) bg-(--Grey100) px-1.5 py-0.5 text-[10px] font-bold text-(--statusB200)">
            {item.unit}
          </span>
        ) : null}
        <span className="ms-auto font-mono text-[10px] text-(--Grey500)">
          #{item.id}
        </span>
      </div>
    </article>
  );
};

export default ItemCategoryCard;
