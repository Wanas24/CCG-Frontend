import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { hueFromString } from "../../utils/listColors";
import type { TMeasurement } from "../types/measurement";

type Props = {
  unit: TMeasurement;
  mode: "manage" | "select";
  selected?: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (unit: TMeasurement) => void;
  onDelete: (unit: TMeasurement) => void;
  onSelect?: (unit: TMeasurement) => void;
};

const UnitCard = ({
  unit,
  mode,
  selected,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  onSelect,
}: Props) => {
  const { t } = useTranslation();
  const hue = hueFromString(unit.unit || unit.id);
  const isSelect = mode === "select";
  const isClickable = isSelect || (mode === "manage" && canEdit);

  const handleActivate = () => {
    if (isSelect) {
      onSelect?.(unit);
      return;
    }
    if (canEdit) {
      onEdit(unit);
    }
  };

  return (
    <article
      className={clsx(
        "relative min-w-0 overflow-hidden rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3 text-start transition",
        "hover:-translate-y-0.5 hover:border-(--Grey400)",
        selected && "border-(--Primary400) ring-2 ring-(--Primary400)/30",
        isClickable && "cursor-pointer",
      )}
      style={{
        backgroundImage: `linear-gradient(180deg, hsl(${hue} 70% 60% / 0.14), transparent 46%)`,
      }}
      onClick={isClickable ? handleActivate : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleActivate();
              }
            }
          : undefined
      }
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, hsl(${hue} 80% 60%), hsl(${(hue + 40) % 360} 80% 58%))`,
        }}
      />
      <div className="flex items-start gap-1.5">
        <p
          className={clsx(
            "m-0 min-w-0 flex-1 truncate font-extrabold tracking-tight text-(--app-text)",
            unit.unit.length > 8 ? "text-lg" : "text-2xl",
          )}
          dir="auto"
          title={unit.unit}
        >
          {unit.unit}
        </p>
        {mode === "manage" && canDelete ? (
          <AppButton
            variant="delete"
            padding="none"
            className="size-7! shrink-0"
            aria-label={t("lists.units.deleteTitle")}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(unit);
            }}
          />
        ) : null}
      </div>
      <p
        className="mt-1.5 mb-0 line-clamp-2 min-h-8 text-xs text-(--Grey600)"
        dir="auto"
      >
        {unit.details?.trim() || t("lists.units.noDetails")}
      </p>
      <div className="mt-2 flex justify-end">
        <span className="font-mono text-[10px] text-(--Grey500)">#{unit.id}</span>
      </div>
    </article>
  );
};

export default UnitCard;
