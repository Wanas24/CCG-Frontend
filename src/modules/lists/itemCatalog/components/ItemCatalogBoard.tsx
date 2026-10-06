import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Package, Plus } from "lucide-react";
import { typeHue } from "../../utils/listColors";
import type { TItemCategory, TItemCategoryType } from "../types/itemCategory";
import ItemCategoryCard from "./ItemCategoryCard";

type Props = {
  types: TItemCategoryType[];
  items: TItemCategory[];
  activeType?: number;
  canDelete: boolean;
  canCreate: boolean;
  onOpen: (item: TItemCategory) => void;
  onDelete: (item: TItemCategory) => void;
  onAdd: (type: number) => void;
};

const AddTypeCard = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    className="flex min-h-28 min-w-0 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-(--Grey300) bg-transparent px-3 py-4 text-center text-sm font-semibold text-(--Grey600) transition hover:border-(--Primary400) hover:bg-(--Primary100)/40 hover:text-(--app-text)"
    onClick={onClick}
  >
    <Plus size={16} className="shrink-0" />
    <span className="min-w-0 truncate">{label}</span>
  </button>
);

const ItemCatalogBoard = ({
  types,
  items,
  activeType,
  canDelete,
  canCreate,
  onOpen,
  onDelete,
  onAdd,
}: Props) => {
  const { t } = useTranslation();

  const lanes = useMemo(() => {
    const known = new Set(types.map((type) => type.value));
    const orphanTypes = items
      .filter((item) => !known.has(item.type))
      .reduce<TItemCategoryType[]>((acc, item) => {
        if (acc.some((type) => type.value === item.type)) return acc;
        acc.push({
          value: item.type,
          name: item.typeName || `Type ${item.type}`,
        });
        return acc;
      }, []);

    return [...types, ...orphanTypes].map((type) => ({
      type,
      items: items.filter((item) => item.type === type.value),
    }));
  }, [items, types]);

  const activeTypeMeta = useMemo(() => {
    if (activeType === undefined) return undefined;
    return (
      types.find((type) => type.value === activeType) ??
      lanes.find((lane) => lane.type.value === activeType)?.type ?? {
        value: activeType,
        name: String(activeType),
      }
    );
  }, [activeType, lanes, types]);

  if (activeType !== undefined && activeTypeMeta) {
    const filteredItems = items.filter((item) => item.type === activeType);

    return (
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <ItemCategoryCard
            key={item.id}
            item={item}
            canDelete={canDelete}
            onOpen={onOpen}
            onDelete={onDelete}
          />
        ))}
        {canCreate ? (
          <AddTypeCard
            label={t("lists.itemCatalog.addType", {
              type: activeTypeMeta.name,
            })}
            onClick={() => onAdd(activeTypeMeta.value)}
          />
        ) : null}
      </div>
    );
  }

  if (lanes.length === 0) {
    return null;
  }

  return (
    <div
      className="grid w-full min-w-0 gap-2 sm:gap-3"
      style={{
        gridTemplateColumns: `repeat(${lanes.length}, minmax(0, 1fr))`,
      }}
    >
      {lanes.map(({ type, items: laneItems }) => {
        const hue = typeHue(type.value);

        return (
          <section
            key={type.value}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-(--Grey300) bg-(--Grey100)"
            style={{
              borderTopWidth: 2,
              borderTopColor: `hsl(${hue} 75% 55%)`,
            }}
          >
            <header className="flex items-center gap-2 p-2.5 sm:gap-2.5 sm:p-3">
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-xl text-white sm:size-8"
                style={{
                  background: `linear-gradient(135deg, hsl(${hue} 75% 56%), hsl(${(hue + 36) % 360} 75% 46%))`,
                }}
              >
                <Package size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="m-0 truncate text-xs font-semibold text-(--app-text) sm:text-sm">
                    {type.name}
                  </h3>
                  <span className="shrink-0 rounded-full border border-(--Grey300) bg-(--app-surface) px-1.5 py-0.5 text-[10px] font-bold text-(--Grey600)">
                    {laneItems.length}
                  </span>
                </div>
                <p className="m-0 truncate text-[10px] text-(--Grey500) sm:text-[11px]">
                  {t("lists.itemCatalog.laneItemCount", {
                    count: laneItems.length,
                  })}
                </p>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-2 px-2 pb-2.5 sm:gap-2.5 sm:px-2.5 sm:pb-3">
              {laneItems.map((item) => (
                <ItemCategoryCard
                  key={item.id}
                  item={item}
                  canDelete={canDelete}
                  onOpen={onOpen}
                  onDelete={onDelete}
                />
              ))}
              {canCreate ? (
                <button
                  type="button"
                  className="mt-auto flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-(--Grey300) bg-transparent px-2 py-2.5 text-center text-xs font-semibold text-(--Grey600) transition hover:border-(--Primary400) hover:bg-(--Primary100)/40 hover:text-(--app-text) sm:min-h-14 sm:gap-2 sm:px-3 sm:text-sm"
                  onClick={() => onAdd(type.value)}
                >
                  <Plus size={14} className="shrink-0" />
                  <span className="min-w-0 truncate">
                    {t("lists.itemCatalog.addType", { type: type.name })}
                  </span>
                </button>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ItemCatalogBoard;
