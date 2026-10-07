import { memo, useMemo } from "react";
import clsx from "clsx";
import { Copy, PenLine, Plus, RotateCcw, Star, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import type { TLayout } from "../types";
import { toDraft } from "../utils/layoutPayload";
import { layoutText } from "../utils/layoutText";
import { PRESET_KEYS } from "../utils/layoutPresets";
import type { ReportLayoutStudioApi } from "../hooks/useReportLayoutStudio";
import ReportLayoutPaper from "./ReportLayoutPaper";

type Props = {
  studio: ReportLayoutStudioApi;
};

const compactButton = "h-8! w-fit! px-2.5! text-xs!";

type LayoutCardProps = {
  layout: TLayout;
  current: boolean;
  canGet: boolean;
  canUpdate: boolean;
  canDeactivate: boolean;
  onOpen: (layoutId: string) => void;
  onDuplicate: (layoutId: string) => void;
  onMakeDefault: (layoutId: string) => void;
  onReactivate: (layoutId: string) => void;
  onDeactivate: (layoutId: string) => void;
};

const LayoutCard = memo(({
  layout,
  current,
  canGet,
  canUpdate,
  canDeactivate,
  onOpen,
  onDuplicate,
  onMakeDefault,
  onReactivate,
  onDeactivate,
}: LayoutCardProps) => {
  const { t } = useTranslation();
  const draft = useMemo(() => toDraft(layout), [layout]);
  const editable = !layout.isSystem && layout.companyId !== null;
  const paper = layoutText(t, `reportLayout.options.paper.${layout.paperSize}`);
  const orientation = layout.orientation === 2
    ? t("reportLayout.gallery.landscape")
    : t("reportLayout.gallery.portrait");
  const direction = layoutText(t, `reportLayout.options.direction.${layout.direction}`);

  return (
    <article
      className={clsx(
        "flex flex-col gap-3 rounded-2xl border bg-(--app-surface) p-3.5 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-(--Primary400)",
        current ? "border-(--Primary400)" : "border-(--Grey300)",
        !layout.isActive && "opacity-70",
      )}
    >
      <div className="grid h-44 place-items-center overflow-hidden rounded-xl border border-(--Grey300) bg-(--Grey100) p-2.5">
        <ReportLayoutPaper
          draft={draft}
          sampleTitle=""
          sampleSubtitle=""
          contentKind={1}
          pxPerMm={0.46}
        />
      </div>
      <h3 className="truncate text-[15px] font-bold" title={layout.name}>
        {layout.name}
      </h3>
      <div className="flex flex-wrap items-center gap-1.5">
        <code className="text-[11px] text-(--Grey600)">{layout.code}</code>
        {layout.isSystem ? (
          <span className="rounded-full border border-(--Secondary300) px-2 py-0.5 text-[10px] font-bold tracking-wide text-(--Secondary300) uppercase">
            {t("reportLayout.badges.system")}
          </span>
        ) : null}
        {layout.isDefault ? (
          <span className="rounded-full border border-(--statusG300) px-2 py-0.5 text-[10px] font-bold tracking-wide text-(--statusG200) uppercase">
            {t("reportLayout.badges.default")}
          </span>
        ) : null}
        {!layout.isActive ? (
          <span className="rounded-full border border-(--statusY200) px-2 py-0.5 text-[10px] font-bold tracking-wide text-(--statusY200) uppercase">
            {t("reportLayout.badges.inactive")}
          </span>
        ) : null}
        {layout.signatures.length > 0 ? (
          <span className="rounded-full border border-(--statusB200) px-2 py-0.5 text-[10px] font-bold tracking-wide text-(--statusB200) uppercase">
            {layout.signatures.length === 1
              ? t("reportLayout.badges.signature")
              : t("reportLayout.badges.signatures", { count: layout.signatures.length })}
          </span>
        ) : null}
      </div>
      <p className="line-clamp-2 min-h-8 text-[12.5px] text-(--Grey600)">
        {layout.description?.trim() || t("reportLayout.gallery.noDescription")}
      </p>
      <p className="text-xs text-(--Grey500)">
        {paper} · {orientation} · {direction}
      </p>
      <div className="flex flex-wrap items-center gap-1.5 border-t border-(--Grey300) pt-2.5">
        {canGet ? (
          <AppButton
            variant="primary"
            className={compactButton}
            icon={<PenLine size={14} />}
            onClick={() => void onOpen(layout.id)}
          >
            {t("reportLayout.gallery.open")}
          </AppButton>
        ) : null}
        {canGet ? (
          <AppButton
            variant="secondary"
            className={compactButton}
            icon={<Copy size={14} />}
            onClick={() => void onDuplicate(layout.id)}
          >
            {t("reportLayout.gallery.duplicate")}
          </AppButton>
        ) : null}
        <span className="flex-1" />
        {editable && canUpdate && layout.isActive && !layout.isDefault ? (
          <button
            type="button"
            className="grid size-8 place-items-center rounded-lg text-(--Grey600) hover:bg-(--Grey100)"
            title={t("reportLayout.gallery.makeDefault")}
            onClick={() => onMakeDefault(layout.id)}
          >
            <Star size={16} />
          </button>
        ) : null}
        {editable && canUpdate && !layout.isActive ? (
          <button
            type="button"
            className="grid size-8 place-items-center rounded-lg text-(--Grey600) hover:bg-(--Grey100)"
            title={t("reportLayout.gallery.reactivate")}
            onClick={() => onReactivate(layout.id)}
          >
            <RotateCcw size={16} />
          </button>
        ) : null}
        {editable && canDeactivate && layout.isActive ? (
          <button
            type="button"
            className="grid size-8 place-items-center rounded-lg text-(--statusR200) hover:bg-(--statusR100)"
            title={t("reportLayout.gallery.deactivate")}
            onClick={() => onDeactivate(layout.id)}
          >
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>
    </article>
  );
});

LayoutCard.displayName = "LayoutCard";

const ReportLayoutGallery = ({ studio }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
      {studio.permissions.canCreate ? (
        <div className="grid min-h-64 cursor-pointer place-items-center content-center gap-2.5 rounded-2xl border-2 border-dashed border-(--Grey300) p-4 text-center text-[13px] font-semibold text-(--Grey600) transition-colors hover:border-(--Primary400) hover:bg-(--Grey100)">
          <button
            type="button"
            className="grid cursor-pointer place-items-center gap-2.5"
            onClick={() => studio.startNew(null)}
          >
            <span className="grid size-11 place-items-center rounded-[14px] border border-(--Grey300) bg-(--Grey100)">
              <Plus size={18} />
            </span>
            <span>{t("reportLayout.gallery.newTitle")}</span>
            <span className="text-xs font-normal text-(--Grey500)">{t("reportLayout.gallery.newHint")}</span>
          </button>
          <span className="flex flex-wrap justify-center gap-1.5">
            {PRESET_KEYS.map((preset) => (
              <button
                key={preset}
                type="button"
                className="cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold text-(--Grey600) hover:bg-(--app-surface)"
                onClick={() => studio.startNew(preset)}
              >
                {layoutText(t, `reportLayout.presets.${preset}`)}
              </button>
            ))}
          </span>
        </div>
      ) : null}
      {studio.layouts.length === 0 ? (
        <p className="col-span-full py-8 text-center text-sm text-(--Grey500)">
          {t("reportLayout.gallery.empty")}
        </p>
      ) : (
        studio.layouts.map((layout) => (
          <LayoutCard
            key={layout.id}
            layout={layout}
            current={studio.editing?.id === layout.id}
            canGet={studio.permissions.canGet}
            canUpdate={studio.permissions.canUpdate}
            canDeactivate={studio.permissions.canDeactivate}
            onOpen={studio.openLayout}
            onDuplicate={studio.duplicateLayout}
            onMakeDefault={studio.requestMakeDefault}
            onReactivate={studio.reactivate}
            onDeactivate={studio.requestDeactivate}
          />
        ))
      )}
    </div>
  );
};

export default ReportLayoutGallery;
