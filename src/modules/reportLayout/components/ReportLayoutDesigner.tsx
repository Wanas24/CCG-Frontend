import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AlertCircle, CheckCircle2, Copy, FileText, Info, PenLine } from "lucide-react";
import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import AppSegmented from "@/shared/ANTD_UIComponents/AppTabs/AppSegmented";
import { CONTENT_KIND } from "../types";
import { paperSizeMm } from "../utils/paperGeometry";
import type { ReportLayoutStudioApi, TCanvasMode, TZoom } from "../hooks/useReportLayoutStudio";
import ReportLayoutInspector from "./ReportLayoutInspector";
import ReportLayoutPaper from "./ReportLayoutPaper";

type Props = {
  studio: ReportLayoutStudioApi;
};

const compactButton = "h-8! w-fit! px-2.5! text-xs!";

const inputClass =
  "rounded-[10px] border border-(--Grey300) bg-(--Grey100) px-2.5 py-1.5 text-[13px] text-(--app-text) outline-none focus:border-(--Primary400)";

const noteClass = {
  err: "border-(--statusR200) bg-(--statusR100) text-(--statusR200)",
  warn: "border-(--statusY200) bg-(--statusY100) text-(--statusY200)",
  info: "border-(--statusB200) bg-(--statusB100) text-(--statusB200)",
} as const;

const ReportLayoutDesigner = ({ studio }: Props) => {
  const { t } = useTranslation();
  const stageRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [widthMm] = paperSizeMm(studio.draft);
  const basePx = 2.2;
  const naturalWidth = widthMm * basePx;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || (studio.zoom !== "fit" && studio.zoom !== "fitw")) return;
    const update = () => {
      const available = Math.max(120, stage.clientWidth - 48);
      const pageFit = available / naturalWidth;
      setFitScale(studio.zoom === "fitw" ? pageFit : Math.min(pageFit, 1.15));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [naturalWidth, studio.zoom]);

  const numericZoom = studio.zoom === "fit" || studio.zoom === "fitw"
    ? fitScale
    : Number(studio.zoom);
  const pxPerMm = basePx * (Number.isFinite(numericZoom) && numericZoom > 0 ? numericZoom : 1);
  const quotaBlocksCreate = studio.quotaReached;
  const canUpdate =
    Boolean(studio.editing && !studio.editing.isSystem) &&
    studio.permissions.canUpdate &&
    studio.blockingCount === 0 &&
    !studio.isSaving;

  if (!studio.hasDraft) {
    return (
      <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-(--Grey300) p-8 text-center">
        <div className="grid max-w-md gap-3">
          <p className="text-sm text-(--Grey600)">{t("reportLayout.editor.empty")}</p>
          {studio.permissions.canCreate ? (
            <AppButton className="mx-auto h-10! w-fit!" onClick={() => studio.startNew(null)}>
              {t("reportLayout.editor.startBlank")}
            </AppButton>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-(--Grey300) bg-(--app-surface) px-4 py-3 shadow-sm">
        <span className="grid size-8 place-items-center rounded-[10px] bg-(--Primary400) text-(--app-surface)">
          <PenLine size={16} />
        </span>
        <div className="min-w-0">
          <b className="block truncate text-sm">
            {studio.editing ? studio.draft.name || studio.editing.id : t("reportLayout.editor.newTitle")}
          </b>
          <span className="text-xs text-(--Grey600)">
            {studio.editing ? (
              <>
                <code>{studio.draft.code}</code>
                {" · "}
                {studio.editing.isSystem
                  ? t("reportLayout.editor.systemHint")
                  : t("reportLayout.editor.companyHint")}
              </>
            ) : (
              t("reportLayout.editor.newHint")
            )}
          </span>
        </div>
        {studio.changes.length > 0 ? (
          <span className="rounded-full border border-(--statusY200) px-2 py-0.5 text-[10px] font-bold text-(--statusY200) uppercase">
            {studio.changes.length === 1
              ? t("reportLayout.badges.unsavedOne")
              : t("reportLayout.badges.unsaved", { count: studio.changes.length })}
          </span>
        ) : (
          <span className="rounded-full border border-(--statusG300) px-2 py-0.5 text-[10px] font-bold text-(--statusG200) uppercase">
            {t("reportLayout.badges.inSync")}
          </span>
        )}
        {studio.blockingCount > 0 ? (
          <span className="rounded-full border border-(--statusR200) px-2 py-0.5 text-[10px] font-bold text-(--statusR200) uppercase">
            {studio.blockingCount === 1
              ? t("reportLayout.badges.blockingOne")
              : t("reportLayout.badges.blocking", { count: studio.blockingCount })}
          </span>
        ) : null}
        <span className="flex-1" />
        <AppButton variant="secondary" className={compactButton} icon={<Copy size={14} />} onClick={studio.duplicateDraft}>
          {t("reportLayout.editor.duplicateDraft")}
        </AppButton>
        {studio.permissions.canCreate ? (
          <AppButton
            variant="secondary"
            className={compactButton}
            disabled={quotaBlocksCreate || studio.isSaving}
            title={
              quotaBlocksCreate && studio.quotaLimit !== null
                ? t("reportLayout.editor.quotaBlocked", { limit: studio.quotaLimit })
                : undefined
            }
            onClick={studio.openSaveAsNew}
          >
            {t("reportLayout.editor.saveAsNew")}
          </AppButton>
        ) : null}
        {studio.permissions.canUpdate && !studio.editing?.isSystem ? (
          <AppButton
            className={compactButton}
            disabled={!canUpdate}
            loading={studio.isSaving}
            onClick={studio.updateLayout}
          >
            {t("reportLayout.editor.update")}
          </AppButton>
        ) : null}
      </div>

      <div className="grid items-start gap-4 min-[1500px]:grid-cols-[372px_minmax(0,1fr)_330px] xl:grid-cols-[350px_minmax(0,1fr)]">
        <ReportLayoutInspector studio={studio} />
        <section className="flex h-[calc(100vh-120px)] min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-sm">
          <div className="flex shrink-0 flex-wrap items-center gap-2.5 border-b border-(--Grey300) px-4 py-3">
            <AppSegmented<TCanvasMode>
              className="w-fit!"
              value={studio.canvas}
              onChange={studio.setCanvas}
              options={[
                { value: "mock", label: t("reportLayout.canvas.live") },
                { value: "pdf", label: t("reportLayout.canvas.pdf") },
              ]}
            />
            <select
              className={inputClass}
              value={studio.contentKind}
              onChange={(event) => studio.setContentKind(Number(event.target.value) === 2 ? CONTENT_KIND.PlainText : CONTENT_KIND.Table)}
            >
              <option value={1}>{t("reportLayout.canvas.table")}</option>
              <option value={2}>{t("reportLayout.canvas.text")}</option>
            </select>
            <select
              className={inputClass}
              value={studio.zoom}
              onChange={(event) => studio.setZoom(event.target.value as TZoom)}
            >
              <option value="fit">{t("reportLayout.canvas.fit")}</option>
              <option value="fitw">{t("reportLayout.canvas.fitWidth")}</option>
              <option value="0.5">{t("reportLayout.canvas.zoom50")}</option>
              <option value="0.75">{t("reportLayout.canvas.zoom75")}</option>
              <option value="1">{t("reportLayout.canvas.zoom100")}</option>
              <option value="1.5">{t("reportLayout.canvas.zoom150")}</option>
            </select>
            <label className="inline-flex items-center gap-2 text-[13px] font-semibold">
              <Switch size="small" checked={studio.guides} onChange={studio.setGuides} />
              {t("reportLayout.canvas.guides")}
            </label>
            <span className="flex-1" />
            {studio.pdfStale ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-(--statusY200)">
                <AlertCircle size={14} />
                {t("reportLayout.canvas.stale")}
              </span>
            ) : null}
            {studio.permissions.canPreview ? (
              <>
                <label className="inline-flex items-center gap-2 text-[13px] font-semibold">
                  <Switch size="small" checked={studio.autoPdf} onChange={studio.setAutoPdf} />
                  {t("reportLayout.canvas.autoPdf")}
                </label>
                <AppButton
                  variant="secondary"
                  className={compactButton}
                  icon={<FileText size={14} />}
                  loading={studio.pdfLoading}
                  onClick={studio.renderPdf}
                >
                  {t("reportLayout.canvas.render")}
                </AppButton>
              </>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5 border-b border-(--Grey300) px-4 py-2.5">
            <input
              className={clsx(inputClass, "min-w-48 flex-2")}
              value={studio.sampleTitle}
              placeholder={t("reportLayout.canvas.titlePlaceholder")}
              onChange={(event) => studio.setSampleTitle(event.target.value)}
            />
            <input
              className={clsx(inputClass, "min-w-40 flex-2")}
              value={studio.sampleSubtitle}
              placeholder={t("reportLayout.canvas.subtitlePlaceholder")}
              onChange={(event) => studio.setSampleSubtitle(event.target.value)}
            />
          </div>
          {studio.canvas === "mock" ? (
            <div ref={stageRef} className="min-h-0 flex-1 overflow-auto bg-(--Grey100) px-4 py-5">
              <ReportLayoutPaper
                draft={studio.draft}
                sampleTitle={studio.sampleTitle}
                sampleSubtitle={studio.sampleSubtitle}
                contentKind={studio.contentKind}
                guides={studio.guides}
                pxPerMm={pxPerMm}
                showCaptions
                maxPages={2}
              />
            </div>
          ) : studio.pdfUrl && !studio.pdfError ? (
            <iframe
              title={t("reportLayout.canvas.pdf")}
              src={studio.pdfUrl}
              className="min-h-0 w-full flex-1 border-0 bg-(--app-surface)"
            />
          ) : (
            <div className="grid min-h-0 flex-1 place-items-center px-6 py-14 text-center text-sm text-(--Grey600)">
              <div className="grid max-w-md gap-3">
                <p>{studio.pdfError || t("reportLayout.canvas.emptyPdf")}</p>
              </div>
            </div>
          )}
        </section>
        <aside className="grid content-start gap-4 xl:col-span-2 min-[1500px]:col-auto min-[1500px]:flex min-[1500px]:flex-col">
          <section className="rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-sm">
            <div className="flex items-center gap-2 px-4 pt-3.5">
              <h2 className="text-[15px] font-bold">{t("reportLayout.checks.title")}</h2>
              <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
                {studio.checks.length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 px-4 py-3">
              {studio.checks.length === 0 ? (
                <div className="flex gap-2 rounded-[11px] border border-(--statusG300) bg-(--statusG100) p-2.5 text-[12.5px] text-(--statusG200)">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <span>{t("reportLayout.checks.clear")}</span>
                </div>
              ) : (
                studio.checks.map((item) => (
                  <div
                    key={`${item.level}-${item.text}`}
                    className={clsx("flex gap-2 rounded-[11px] border p-2.5 text-[12.5px] leading-snug", noteClass[item.level])}
                  >
                    {item.level === "info" ? <Info size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
                    <span>{item.text}</span>
                  </div>
                ))
              )}
            </div>
          </section>
          <section className="rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-sm">
            <div className="flex items-center gap-2 px-4 pt-3.5">
              <h2 className="text-[15px] font-bold">{t("reportLayout.diff.title")}</h2>
              <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
                {studio.changes.length}
              </span>
              <AppButton variant="secondary" className={clsx(compactButton, "ms-auto")} onClick={studio.revert} disabled={studio.changes.length === 0}>
                {t("reportLayout.editor.revert")}
              </AppButton>
            </div>
            <div className="flex max-h-72 flex-col gap-1.5 overflow-auto px-4 py-3">
              {studio.changes.length === 0 ? (
                <p className="text-xs text-(--Grey500)">{t("reportLayout.diff.empty")}</p>
              ) : (
                studio.changes.map((change) => (
                  <div key={`${change.label}-${change.to}`} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-[10px] border border-(--Grey300) bg-(--Grey100) px-2.5 py-1.5 text-xs">
                    <b className="font-semibold">{change.label}</b>
                    <span className="max-w-36 truncate font-mono text-[10.5px] text-(--Grey600)" dir="ltr">
                      <s className="text-(--Grey500)">{change.from}</s>
                      {" → "}
                      {change.to}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ReportLayoutDesigner;
