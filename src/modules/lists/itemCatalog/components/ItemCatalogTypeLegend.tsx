import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { typeHue } from "../../utils/listColors";
import { TEMP_ITEM_CATALOG_TYPE_MIX_COUNT } from "../constants/tempItemCatalogTypeMix";
import type { TItemCategoryType } from "../types/itemCategory";

type Props = {
  types: TItemCategoryType[];
  totalCount: number;
  activeType?: number;
  onSelectType: (type: number | undefined) => void;
};

const ItemCatalogTypeLegend = ({
  types,
  totalCount,
  activeType,
  onSelectType,
}: Props) => {
  const { t } = useTranslation();
  const segmentCount = TEMP_ITEM_CATALOG_TYPE_MIX_COUNT;
  const total = Math.max(types.length * segmentCount, 1);
  const segments = types.map((type) => ({
    ...type,
    count: segmentCount,
  }));

  return (
    <div className="flex flex-col gap-3 mb-3">
      <p className="m-0 text-xs font-medium text-(--Grey500)">
        {t("lists.itemCatalog.mixTitle")}
      </p>
      <div
        className="flex h-2.5 overflow-hidden rounded-full bg-(--Grey200)"
        title={t("lists.itemCatalog.mixTitle")}
      >
        {segments.length === 0 ? (
          <span className="block h-full w-full bg-(--Grey300)" />
        ) : (
          segments.map((segment) => (
            <i
              key={segment.value}
              className="block h-full min-w-1"
              style={{
                width: `${(segment.count / total) * 100}%`,
                background: `hsl(${typeHue(segment.value)} 75% 58%)`,
              }}
              title={`${segment.name} · ${segment.count}`}
            />
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
            activeType === undefined
              ? "border-(--app-text) bg-(--app-text) text-(--app-surface)"
              : "border-(--Grey300) bg-transparent text-(--Grey600) hover:border-(--Grey400)",
          )}
          onClick={() => onSelectType(undefined)}
        >
          {t("lists.itemCatalog.typeFilterAll")}
          <b className="font-bold tabular-nums">{totalCount}</b>
        </button>
        {types.map((type) => {
          const count = TEMP_ITEM_CATALOG_TYPE_MIX_COUNT;
          const active = activeType === type.value;
          return (
            <button
              key={type.value}
              type="button"
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
                active
                  ? "border-(--app-text) bg-(--app-text) text-(--app-surface)"
                  : "border-(--Grey300) bg-transparent text-(--Grey600) hover:border-(--Grey400)",
              )}
              onClick={() => onSelectType(type.value)}
            >
              <i
                className="size-2 rounded-full"
                style={{
                  background: active
                    ? "var(--app-surface)"
                    : `hsl(${typeHue(type.value)} 80% 60%)`,
                }}
              />
              {type.name}
              <b className="font-bold tabular-nums">{count}</b>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ItemCatalogTypeLegend;
