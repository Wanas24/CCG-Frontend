import { startTransition, ViewTransition, type ReactNode } from "react";
import { Info, LayoutGrid, PenLine, RefreshCw, ChartNoAxesCombined } from "lucide-react";
import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import { AppButton, AppSkeleton } from "@/shared/ANTD_UIComponents";
import AppSegmented from "@/shared/ANTD_UIComponents/AppTabs/AppSegmented";
import type { ReportLayoutStudioApi, TStudioView } from "../hooks/useReportLayoutStudio";
import ReportLayoutDesigner from "./ReportLayoutDesigner";
import ReportLayoutDialogs from "./ReportLayoutDialogs";
import ReportLayoutGallery from "./ReportLayoutGallery";
import ReportLayoutUsage from "./ReportLayoutUsage";
import "../styles/reportLayoutView.css";

type Props = {
  studio: ReportLayoutStudioApi;
};

const glowClassName = {
  primary: "bg-(--Primary400)",
  secondary: "bg-(--Secondary300)",
  green: "bg-(--statusG200)",
  amber: "bg-(--statusY200)",
} as const;

type StatGlow = keyof typeof glowClassName;

type StatCardProps = {
  title: string;
  value: ReactNode;
  content: ReactNode;
  glow: StatGlow;
  extra?: ReactNode;
};

const summarySkeleton = (
  <>
    <AppSkeleton.Node active className="h-[118px]! w-full!" />
    <AppSkeleton.Node active className="h-[118px]! w-full!" />
    <AppSkeleton.Node active className="h-[118px]! w-full!" />
  </>
);

const ReportLayoutStats = ({ studio }: Props) => {
  const { t } = useTranslation();
  const summary = studio.summary;
  const quotaUsed = studio.quotaUsed ?? 0;
  const quotaLimit = studio.quotaLimit ?? 0;
  const slotsLeft = Math.max(0, quotaLimit - quotaUsed);
  const quotaWidth = quotaLimit > 0 ? Math.min(100, (quotaUsed / quotaLimit) * 100) : 0;
  const unsavedCount = studio.changes.length;
  const summaryCards = studio.isSummaryLoading ? (
    summarySkeleton
  ) : studio.summaryError ? (
    <p className="rounded-xl border border-(--statusR200) bg-(--statusR100) p-4 text-sm text-(--statusR200) lg:col-span-2 xl:col-span-3">
      {studio.summaryError}
    </p>
  ) : (
    <>
      <StatCard
        title={t("reportLayout.stats.layouts")}
        value={String(summary?.totalCount ?? 0)}
        content={t("reportLayout.stats.companySystem", {
          company: summary?.companyCount ?? 0,
          system: summary?.systemCount ?? 0,
        })}
        glow="primary"
      />
      <StatCard
        title={t("reportLayout.stats.quota")}
        value={
          <>
            {quotaUsed}
            <span className="text-base font-semibold text-(--Grey500)">/{quotaLimit}</span>
          </>
        }
        content={t("reportLayout.stats.slotsLeft", { count: slotsLeft })}
        extra={
          <div className="h-1.5 overflow-hidden rounded-full bg-(--Grey300)">
            <div
              className="h-full rounded-full bg-(--Secondary300)"
              style={{ width: `${quotaWidth}%` }}
            />
          </div>
        }
        glow="secondary"
      />
      <StatCard
        title={t("reportLayout.stats.defaultLayout")}
        value={<span className="text-lg">{summary?.defaultLayoutName || "—"}</span>}
        content={
          summary?.defaultIsSystem
            ? `${t("reportLayout.stats.code", { code: summary.defaultLayoutCode || "—" })} · ${t("reportLayout.badges.system")}`
            : t("reportLayout.stats.code", { code: summary?.defaultLayoutCode || "—" })
        }
        glow="green"
      />
    </>
  );

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {summaryCards}
      <StatCard
        title={t("reportLayout.stats.unsaved")}
        value={String(unsavedCount)}
        content={
          unsavedCount === 0
            ? t("reportLayout.stats.nothingEdited")
            : unsavedCount === 1
              ? t("reportLayout.badges.unsavedOne")
              : t("reportLayout.badges.unsaved", { count: unsavedCount })
        }
        glow="amber"
      />
    </div>
  );
};

const StatCard = ({ title, value, content, glow, extra }: StatCardProps) => (
  <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-(--Grey300) bg-(--app-surface) p-4 shadow-xl">
    <div
      className={`absolute -top-10 -end-8 size-25 rounded-full opacity-30 blur-2xl ${glowClassName[glow]}`}
    />
    <p className="text-xs font-semibold tracking-wide text-(--Grey600) uppercase">{title}</p>
    <div className="flex min-h-9 items-center py-1 text-2xl font-bold text-(--app-text)">{value}</div>
    <div className="text-sm text-(--Grey500)">{content}</div>
    <div className="mt-auto pt-3">
      {extra ?? <div className="h-1.5" aria-hidden />}
    </div>
  </div>
);

const ReportLayoutStudioView = ({ studio }: Props) => {
  const { t } = useTranslation();

  if (studio.isLoading) {
    return (
      <div className="grid gap-4">
        <AppSkeleton active paragraph={{ rows: 1 }} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
          <AppSkeleton.Node active className="h-64! w-full!" />
          <AppSkeleton.Node active className="h-64! w-full!" />
          <AppSkeleton.Node active className="h-64! w-full!" />
        </div>
      </div>
    );
  }

  if (studio.loadError) {
    return (
      <p className="rounded-2xl border border-(--statusR200) bg-(--statusR100) p-4 text-sm text-(--statusR200)">
        {studio.loadError}
      </p>
    );
  }

  const views: Array<{ id: TStudioView; label: string; icon: typeof LayoutGrid }> = [
    { id: "gallery", label: t("reportLayout.views.gallery"), icon: LayoutGrid },
    { id: "designer", label: t("reportLayout.views.designer"), icon: PenLine },
  ];
  if (studio.permissions.canLastUsed) {
    views.push({
      id: "usage",
      label: t("reportLayout.views.usage"),
      icon: ChartNoAxesCombined,
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-(--app-text)">{t("reportLayout.title")}</h1>
          <p className="text-xs text-(--Grey600)">{t("reportLayout.subtitle")}</p>
        </div>
        <AppButton
          variant="secondary"
          className="h-9! w-fit! px-3!"
          icon={<RefreshCw size={15} />}
          onClick={studio.reload}
        >
          {t("reportLayout.reload")}
        </AppButton>
      </div>

      <ReportLayoutStats studio={studio} />

      <div className="flex flex-wrap items-center gap-3">
        <AppSegmented<TStudioView>
          className="w-fit!"
          value={studio.view}
          onChange={(view) => startTransition(() => studio.setView(view))}
          options={views.map((item) => {
            const Icon = item.icon;
            return {
              value: item.id,
              label: item.label,
              icon: <Icon size={16} />,
            };
          })}
        />
        <label className="inline-flex items-center gap-2 text-[13px] font-semibold">
          <Switch
            size="small"
            checked={studio.includeInactive}
            onChange={studio.setIncludeInactive}
          />
          {t("reportLayout.showInactive")}
        </label>
        <span className="ms-auto inline-flex items-center gap-1.5 text-xs text-(--Grey500)">
          <Info size={14} />
          {t("reportLayout.systemHint")}
        </span>
      </div>

      {studio.isOpening ? <AppSkeleton active paragraph={{ rows: 2 }} /> : null}
      <ViewTransition default="report-layout-view">
        {studio.view === "gallery" ? (
          <ReportLayoutGallery studio={studio} />
        ) : studio.view === "designer" ? (
          <ReportLayoutDesigner studio={studio} />
        ) : studio.view === "usage" && studio.permissions.canLastUsed ? (
          <ReportLayoutUsage studio={studio} />
        ) : null}
      </ViewTransition>
      <ReportLayoutDialogs studio={studio} />
    </div>
  );
};

export default ReportLayoutStudioView;
