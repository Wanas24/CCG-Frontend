import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { REPORT_TYPES } from "../types";
import type { ReportLayoutStudioApi } from "../hooks/useReportLayoutStudio";

type Props = {
  studio: ReportLayoutStudioApi;
};

const compactButton = "h-8! w-fit! px-2.5! text-xs!";

const steps = [
  ["explicitTitle", "explicitBody"],
  ["lastTitle", "lastBody"],
  ["defaultTitle", "defaultBody"],
  ["systemTitle", "systemBody"],
] as const;

const ReportLayoutUsage = ({ studio }: Props) => {
  const { t } = useTranslation();
  const extra = Object.keys(studio.usage).filter(
    (reportType) => !REPORT_TYPES.includes(reportType as (typeof REPORT_TYPES)[number]),
  );
  const types = [...REPORT_TYPES, ...extra];

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-sm">
        <div className="px-4 pt-4">
          <h2 className="text-[15px] font-bold">{t("reportLayout.usage.title")}</h2>
        </div>
        <div className="flex flex-wrap gap-2.5 px-4 py-3">
          <input
            className="min-w-48 flex-1 rounded-[10px] border border-(--Grey300) bg-(--Grey100) px-2.5 py-1.5 text-[13px] outline-none focus:border-(--Primary400)"
            list="report-layout-types"
            value={studio.customType}
            placeholder={t("reportLayout.usage.customPlaceholder")}
            onChange={(event) => studio.setCustomType(event.target.value)}
          />
          <datalist id="report-layout-types">
            {REPORT_TYPES.map((reportType) => (
              <option key={reportType} value={reportType} />
            ))}
          </datalist>
          <AppButton className={compactButton} onClick={() => void studio.checkType(studio.customType)}>
            {t("reportLayout.usage.check")}
          </AppButton>
          <AppButton variant="secondary" className={compactButton} onClick={() => void studio.checkAllTypes()}>
            {t("reportLayout.usage.checkAll")}
          </AppButton>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-3.5 px-4 pb-4">
          {types.map((reportType) => {
            const entry = studio.usage[reportType];
            return (
              <article key={reportType} className="flex flex-col gap-2 rounded-[14px] border border-(--Grey300) bg-(--Grey100) p-3.5">
                <h3 className="text-[13.5px] font-semibold">{reportType}</h3>
                {!entry || entry.status === "idle" ? (
                  <p className="min-h-8 text-[12.5px] text-(--Grey500)">{t("reportLayout.usage.notChecked")}</p>
                ) : null}
                {entry?.status === "loading" ? (
                  <p className="min-h-8 text-[12.5px] text-(--Grey500)">{t("reportLayout.usage.checking")}</p>
                ) : null}
                {entry?.status === "empty" ? (
                  <div>
                    <span className="rounded-full border border-(--Grey300) px-2 py-0.5 text-[10px] font-bold text-(--Grey600) uppercase">
                      {t("reportLayout.usage.noPreference")}
                    </span>
                    <p className="mt-1.5 text-xs text-(--Grey500)">{t("reportLayout.usage.neverExported")}</p>
                  </div>
                ) : null}
                {entry?.status === "error" ? (
                  <p className="min-h-8 text-[12.5px] text-(--statusR200)">{entry.message}</p>
                ) : null}
                {entry?.status === "found" ? (
                  <div className="min-h-8 text-[12.5px]">
                    <b>{entry.layout.name}</b>
                    <p className="mt-1 text-xs text-(--Grey500)">
                      <code>{entry.layout.code}</code>
                      {entry.layout.isSystem ? ` · ${t("reportLayout.usage.system")}` : ""}
                      {entry.layout.isDefault ? ` · ${t("reportLayout.usage.default")}` : ""}
                    </p>
                  </div>
                ) : null}
                <div className="flex gap-1.5">
                  <AppButton variant="secondary" className={compactButton} onClick={() => void studio.checkType(reportType)}>
                    {t("reportLayout.usage.check")}
                  </AppButton>
                  {entry?.status === "found" && studio.permissions.canGet ? (
                    <AppButton variant="secondary" className={compactButton} onClick={() => void studio.openLayout(entry.layout.id)}>
                      {t("reportLayout.usage.open")}
                    </AppButton>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-sm">
        <h2 className="px-4 pt-4 text-[15px] font-bold">{t("reportLayout.usage.resolutionTitle")}</h2>
        <ol className="flex flex-col px-4 py-4">
          {steps.map(([titleKey, bodyKey], index) => (
            <li key={titleKey} className="relative flex gap-3 pb-4 last:pb-0">
              {index < steps.length - 1 ? (
                <span className="absolute start-3.5 top-8 bottom-0.5 w-0.5 bg-(--Grey300)" />
              ) : null}
              <span className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full border-2 border-(--Grey300) bg-(--app-surface) text-xs font-bold text-(--Grey600)">
                {index + 1}
              </span>
              <div>
                <b className="block text-[13.5px]">{t(`reportLayout.usage.steps.${titleKey}`)}</b>
                <small className="mt-1 block text-xs leading-relaxed text-(--Grey600)">
                  {t(`reportLayout.usage.steps.${bodyKey}`)}
                </small>
              </div>
            </li>
          ))}
        </ol>
        <p className="mx-4 mb-4 rounded-[11px] border border-(--statusB200) bg-(--statusB100) p-2.5 text-[12.5px] leading-snug text-(--statusB200)">
          {t("reportLayout.usage.note")}
        </p>
      </section>
    </div>
  );
};

export default ReportLayoutUsage;
