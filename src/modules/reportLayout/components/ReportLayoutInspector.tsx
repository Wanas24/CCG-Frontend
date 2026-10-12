import { useMemo, type ReactNode } from "react";
import clsx from "clsx";
import {
  ChevronRight,
  Droplets,
  FileText,
  LayoutTemplate,
  Maximize2,
  Minimize2,
  Palette,
  PenLine,
  Search,
  Table2,
  Type,
} from "lucide-react";
import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import {
  LAYOUT_FONTS,
  PLACEHOLDER_TOKENS,
  type TLayoutDraft,
  type TSignatureDraft,
} from "../types";
import {
  isFieldActive,
  LAYOUT_FIELDS,
  SECTION_IDS,
  type TLayoutField,
  type TSectionId,
} from "../utils/layoutFields";
import { layoutText } from "../utils/layoutText";
import type { ReportLayoutStudioApi } from "../hooks/useReportLayoutStudio";
import SignatureImageField from "./SignatureImageField";

type Props = {
  studio: ReportLayoutStudioApi;
};

const sectionIcons: Record<TSectionId, ReactNode> = {
  identity: <FileText size={14} />,
  page: <LayoutTemplate size={14} />,
  title: <Type size={14} />,
  palette: <Palette size={14} />,
  header: <LayoutTemplate size={14} />,
  table: <Table2 size={14} />,
  footer: <LayoutTemplate size={14} />,
  watermark: <Droplets size={14} />,
  signatures: <PenLine size={14} />,
};

const inputClass =
  "w-full rounded-[10px] border border-(--Grey300) bg-(--Grey100) px-2.5 py-2 text-[13px] text-(--app-text) outline-none focus:border-(--Primary400)";

const selectValues: Record<NonNullable<TLayoutField["options"]>, string[]> = {
  paper: ["1", "2", "3", "4"],
  orientation: ["1", "2"],
  direction: ["2", "1"],
  align: ["1", "2", "3"],
  logo: ["1", "2", "3"],
  content: ["Table", "Text"],
};

const safeHex = (value: string | null | undefined, fallback: string) => {
  const raw = value?.trim() ?? "";
  return /^#[0-9a-fA-F]{6}$/.test(raw) ? raw : fallback;
};

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="mt-1 text-[11px] leading-snug text-(--statusR200)">{message}</p>;
};

const FieldControl = ({
  field,
  draft,
  error,
  onPatch,
}: {
  field: TLayoutField;
  draft: TLayoutDraft;
  error?: string;
  onPatch: (patch: Partial<TLayoutDraft>) => void;
}) => {
  const { t } = useTranslation();
  const active = isFieldActive(field, draft);
  const controlClass = clsx(
    inputClass,
    error && "border-(--statusR200)! focus:border-(--statusR200)!",
  );
  const value = draft[field.key];
  const label = layoutText(t, field.labelKey);
  const id = `layout-${field.key}`;

  const setText = (next: string) => {
    onPatch({ [field.key]: next } as Partial<TLayoutDraft>);
  };

  const insertToken = (token: string) => {
    const element = document.getElementById(id) as HTMLTextAreaElement | HTMLInputElement | null;
    const current = typeof value === "string" ? value : "";
    if (!element) {
      setText(`${current}${token}`);
      return;
    }
    const start = element.selectionStart ?? current.length;
    const end = element.selectionEnd ?? current.length;
    const next = `${current.slice(0, start)}${token}${current.slice(end)}`;
    setText(next);
  };

  let control: ReactNode;
  if (field.kind === "bool") {
    control = (
      <label className="flex items-center gap-2.5 rounded-[10px] border border-(--Grey300) bg-(--app-surface) px-2.5 py-2 text-[12.5px] font-semibold">
        <Switch
          size="small"
          checked={Boolean(value)}
          onChange={(checked) => onPatch({ [field.key]: checked } as Partial<TLayoutDraft>)}
        />
        <span>{label}</span>
      </label>
    );
  } else if (field.kind === "select" && field.options) {
    control = (
      <>
        <label htmlFor={id} className="mb-1 block text-[11px] font-semibold text-(--Grey600)">
          {label}
        </label>
        <select
          id={id}
          className={controlClass}
          value={String(value ?? "")}
          onChange={(event) => {
            const next = event.target.value;
            onPatch({
              [field.key]: field.options === "content" ? next : Number(next),
            } as Partial<TLayoutDraft>);
          }}
        >
          {selectValues[field.options].map((option) => (
            <option key={option} value={option}>
              {layoutText(t, `reportLayout.options.${field.options}.${option}`)}
            </option>
          ))}
        </select>
      </>
    );
  } else if (field.kind === "number") {
    control = (
      <>
        <label htmlFor={id} className="mb-1 block text-[11px] font-semibold text-(--Grey600)">
          {label}
        </label>
        <input
          id={id}
          className={controlClass}
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
          value={typeof value === "number" ? value : 0}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            if (Number.isFinite(parsed)) {
              onPatch({ [field.key]: parsed } as Partial<TLayoutDraft>);
            }
          }}
        />
      </>
    );
  } else if (field.kind === "color") {
    const fallback = field.fallbackColor?.(draft) || "#1F4E79";
    const isAuto = field.nullable && (value === null || value === "");
    const hex = safeHex(typeof value === "string" ? value : null, fallback);
    control = (
      <>
        <label htmlFor={id} className="mb-1 block text-[11px] font-semibold text-(--Grey600)">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            aria-label={label}
            className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-(--Grey300) bg-(--Grey100) p-0.5"
            type="color"
            value={hex}
            onChange={(event) => setText(event.target.value)}
          />
          <input
            id={id}
            className={clsx(controlClass, "font-mono text-xs")}
            maxLength={20}
            value={isAuto ? "" : String(value ?? "")}
            placeholder={isAuto ? t("reportLayout.inspector.auto") : undefined}
            onChange={(event) => setText(event.target.value)}
          />
          {field.nullable ? (
            <button
              type="button"
              className={clsx(
                "shrink-0 rounded-lg border px-2 py-1.5 text-[11px] font-bold",
                isAuto
                  ? "border-transparent bg-(--Primary400) text-(--app-surface)"
                  : "border-(--Grey300) text-(--Grey600)",
              )}
              onClick={() => onPatch({ [field.key]: null } as Partial<TLayoutDraft>)}
            >
              {t("reportLayout.inspector.auto")}
            </button>
          ) : null}
        </div>
      </>
    );
  } else {
    const shared = {
      id,
      maxLength: field.maxLength,
      value: typeof value === "string" ? value : "",
      onChange: (event: { target: { value: string } }) => setText(event.target.value),
      className: clsx(controlClass, field.mono && "font-mono text-xs"),
    };
    control = (
      <>
        <label htmlFor={id} className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-(--Grey600)">
          {label}
          {field.required ? <span className="text-(--statusR200)">*</span> : null}
        </label>
        {field.kind === "area" ? (
          <textarea {...shared} rows={2} />
        ) : field.kind === "font" ? (
          <>
            <input {...shared} list="report-layout-fonts" />
          </>
        ) : (
          <input {...shared} />
        )}
        {field.tokens ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {PLACEHOLDER_TOKENS.map((token) => (
              <button
                key={token}
                type="button"
                className="rounded-full border border-dashed border-(--Grey300) px-2 py-0.5 font-mono text-[10.5px] text-(--Grey600)"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => insertToken(token)}
              >
                {token}
              </button>
            ))}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <div className={clsx(field.fullWidth && "col-span-2", !active && "opacity-45")}>
      {control}
      <FieldError message={error} />
      {field.helpKey ? (
        <p className="mt-1 text-[11px] leading-snug text-(--Grey500)">{layoutText(t, field.helpKey)}</p>
      ) : null}
      {!active && field.whyKey ? (
        <p className="mt-1 text-[11px] leading-snug text-(--statusY200)">{layoutText(t, field.whyKey)}</p>
      ) : null}
    </div>
  );
};

const readSignatureNumber = (raw: string) => {
  if (raw.trim() === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const SignatureEditor = ({ studio }: Props) => {
  const { t } = useTranslation();
  const { draft } = studio;

  const update = (uid: string, patch: Partial<TSignatureDraft>) => {
    studio.patchSignature(uid, patch);
  };

  return (
    <div className="col-span-2 flex flex-col gap-2">
      {draft.signatures.map((signature, index) => (
        <details key={signature.uid} className="rounded-xl border border-(--Grey300) bg-(--app-surface)" open>
          <summary className="flex cursor-pointer list-none items-center gap-2 px-2.5 py-2 text-[12.5px] font-semibold">
            <span className="grid size-5 place-items-center rounded-md border border-(--Grey300) text-[10px] text-(--Grey600)">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate">
              {signature.label.trim() || t("reportLayout.signature.untitled", { index: index + 1 })}
            </span>
            <button
              type="button"
              className="grid size-7 place-items-center rounded-lg text-(--Grey600) disabled:opacity-35"
              disabled={index === 0}
              title={t("reportLayout.inspector.moveUp")}
              onClick={(event) => {
                event.preventDefault();
                studio.moveSignature(signature.uid, -1);
              }}
            >
              ↑
            </button>
            <button
              type="button"
              className="grid size-7 place-items-center rounded-lg text-(--Grey600) disabled:opacity-35"
              disabled={index === draft.signatures.length - 1}
              title={t("reportLayout.inspector.moveDown")}
              onClick={(event) => {
                event.preventDefault();
                studio.moveSignature(signature.uid, 1);
              }}
            >
              ↓
            </button>
            <button
              type="button"
              className="grid size-7 place-items-center rounded-lg text-(--statusR200)"
              title={t("reportLayout.inspector.remove")}
              onClick={(event) => {
                event.preventDefault();
                studio.removeSignature(signature.uid);
              }}
            >
              ×
            </button>
          </summary>
          <div className="grid grid-cols-2 gap-2.5 px-2.5 pb-2.5">
            <label className="col-span-2 text-[11px] font-semibold text-(--Grey600)">
              {t("reportLayout.signature.label")}
              <textarea
                className={clsx(
                  inputClass,
                  "mt-1",
                  studio.fieldErrors.signatures[index] && "border-(--statusR200)! focus:border-(--statusR200)!",
                )}
                maxLength={1000}
                value={signature.label}
                onChange={(event) => update(signature.uid, { label: event.target.value })}
              />
              <FieldError message={studio.fieldErrors.signatures[index]} />
            </label>
            <label className="col-span-2 text-[11px] font-semibold text-(--Grey600)">
              {t("reportLayout.signature.title")}
              <textarea
                className={clsx(inputClass, "mt-1")}
                maxLength={1000}
                value={signature.title ?? ""}
                onChange={(event) => update(signature.uid, { title: event.target.value || null })}
              />
            </label>
            <label className="col-span-2 text-[11px] font-semibold text-(--Grey600)">
              {t("reportLayout.signature.name")}
              <textarea
                className={clsx(inputClass, "mt-1")}
                maxLength={1000}
                value={signature.name ?? ""}
                onChange={(event) => update(signature.uid, { name: event.target.value || null })}
              />
              <span className="mt-1 block font-normal text-(--Grey500)">{t("reportLayout.signature.nameHelp")}</span>
            </label>
            <label className="text-[11px] font-semibold text-(--Grey600)">
              {t("reportLayout.signature.align")}
              <select
                className={clsx(inputClass, "mt-1")}
                value={signature.align}
                onChange={(event) => update(signature.uid, { align: Number(event.target.value) as TSignatureDraft["align"] })}
              >
                {["1", "2", "3"].map((option) => (
                  <option key={option} value={option}>
                    {layoutText(t, `reportLayout.options.align.${option}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[11px] font-semibold text-(--Grey600)">
              {t("reportLayout.signature.width")}
              <input
                className={clsx(inputClass, "mt-1")}
                type="number"
                min={5}
                max={200}
                value={signature.widthMm}
                onChange={(event) => {
                  const parsed = readSignatureNumber(event.target.value);
                  if (parsed === null) return;
                  update(signature.uid, { widthMm: parsed });
                }}
              />
            </label>
            <label className="text-[11px] font-semibold text-(--Grey600)">
              {t("reportLayout.signature.height")}
              <input
                className={clsx(inputClass, "mt-1")}
                type="number"
                min={2}
                max={120}
                value={signature.heightMm}
                onChange={(event) => {
                  const parsed = readSignatureNumber(event.target.value);
                  if (parsed === null) return;
                  update(signature.uid, { heightMm: parsed });
                }}
              />
            </label>
            <SignatureImageField
              value={signature.imageUrl ?? ""}
              onChange={(imageUrl) => update(signature.uid, { imageUrl })}
              onRemoved={(imageUrl) => {
                draft.signatures.forEach((item) => {
                  if ((item.imageUrl ?? "").trim() === imageUrl.trim()) {
                    update(item.uid, { imageUrl: null });
                  }
                });
              }}
            />
            <label className="col-span-2 text-[11px] font-semibold text-(--Grey600)">
              {t("reportLayout.signature.instructions")}
              <textarea
                className={clsx(inputClass, "mt-1")}
                maxLength={2000}
                value={signature.instructions ?? ""}
                onChange={(event) => update(signature.uid, { instructions: event.target.value || null })}
              />
            </label>
            {signature.showDateLine ? (
              <label className="col-span-2 text-[11px] font-semibold text-(--Grey600)">
                {t("reportLayout.signature.dateLabel")}
                <input
                  className={clsx(inputClass, "mt-1")}
                  maxLength={200}
                  value={signature.dateLabel ?? ""}
                  onChange={(event) => update(signature.uid, { dateLabel: event.target.value })}
                />
              </label>
            ) : null}
            <label className="col-span-2 flex items-center gap-2 text-[12.5px] font-semibold">
              <Switch size="small" checked={signature.isSignature} onChange={(checked) => update(signature.uid, { isSignature: checked })} />
              {t("reportLayout.signature.isSignature")}
            </label>
            <label className="col-span-2 flex items-center gap-2 text-[12.5px] font-semibold">
              <Switch size="small" checked={signature.showNameLine} onChange={(checked) => update(signature.uid, { showNameLine: checked })} />
              {t("reportLayout.signature.showName")}
            </label>
            <label className="col-span-2 flex items-center gap-2 text-[12.5px] font-semibold">
              <Switch size="small" checked={signature.showDateLine} onChange={(checked) => update(signature.uid, { showDateLine: checked })} />
              {t("reportLayout.signature.showDate")}
            </label>
            <label className="col-span-2 flex items-center gap-2 text-[12.5px] font-semibold">
              <Switch
                size="small"
                checked={signature.repeatOnEveryPage}
                onChange={(checked) => update(signature.uid, { repeatOnEveryPage: checked })}
              />
              {t("reportLayout.signature.repeat")}
            </label>
          </div>
        </details>
      ))}
      <button
        type="button"
        className="mt-1 cursor-pointer w-fit rounded-[10px] border border-(--Grey300) px-2.5 py-1.5 text-xs font-semibold"
        onClick={studio.addSignature}
      >
        {t("reportLayout.inspector.addSignature")}
      </button>
    </div>
  );
};

const ReportLayoutInspector = ({ studio }: Props) => {
  const { t } = useTranslation();
  const query = studio.inspectorQuery.trim().toLowerCase();
  const fields = useMemo(
    () =>
      LAYOUT_FIELDS.filter((field) => {
        if (!query) return true;
        return (
          layoutText(t, field.labelKey).toLowerCase().includes(query) ||
          field.key.toLowerCase().includes(query)
        );
      }),
    [query, t],
  );

  return (
    <section className="flex h-[calc(100vh-120px)] min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-sm">
      <div className="flex shrink-0 flex-wrap items-center gap-2 px-3.5 pt-3.5">
        <h2 className="text-[15px] font-bold">{t("reportLayout.inspector.title")}</h2>
        <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
          {query ? fields.length : LAYOUT_FIELDS.length}
        </span>
        <button
          type="button"
          className="ms-auto grid size-7 place-items-center rounded-lg text-(--Grey600)"
          title={t("reportLayout.inspector.expand")}
          onClick={studio.expandAll}
        >
          <Maximize2 size={15} />
        </button>
        <button
          type="button"
          className="grid size-7 place-items-center rounded-lg text-(--Grey600)"
          title={t("reportLayout.inspector.collapse")}
          onClick={studio.collapseAll}
        >
          <Minimize2 size={15} />
        </button>
      </div>
      <div className="shrink-0 px-3.5 py-2.5">
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-(--Grey500)" />
          <input
            className={clsx(inputClass, "ps-9")}
            value={studio.inspectorQuery}
            placeholder={t("reportLayout.inspector.search")}
            onChange={(event) => studio.setInspectorQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3.5 pb-4">
        <datalist id="report-layout-fonts">
          {LAYOUT_FONTS.map((font) => (
            <option key={font} value={font} />
          ))}
        </datalist>
        {SECTION_IDS.map((sectionId) => {
          const sectionFields = fields.filter((field) => field.section === sectionId);
          const showSignatures = sectionId === "signatures" && (!query || "signature".includes(query) || sectionFields.length > 0);
          if (sectionFields.length === 0 && !showSignatures) return null;
          const open = studio.openSections.has(sectionId);
          return (
            <details
              key={sectionId}
              className="mb-2.5 overflow-hidden rounded-[14px] border border-(--Grey300) bg-(--Grey200)"
              open={open}
              onToggle={(event) => studio.toggleSection(sectionId, event.currentTarget.open)}
            >
              <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3 py-2.5 text-[13px] font-semibold">
                <span className="grid size-6 place-items-center rounded-lg bg-(--Primary400) text-(--app-surface)">
                  {sectionIcons[sectionId]}
                </span>
                {layoutText(t, `reportLayout.sections.${sectionId}`)}
                <ChevronRight
                  size={16}
                  className={clsx(
                    "ms-auto text-(--Grey500) transition-transform",
                    open ? "rotate-90" : "rtl:rotate-180",
                  )}
                />
              </summary>
              {open ? (
                <div className="grid grid-cols-2 gap-2.5 px-3 pb-3">
                  {sectionFields.map((field) => (
                    <FieldControl
                      key={field.key}
                      field={field}
                      draft={studio.draft}
                      error={studio.fieldErrors.fields[field.key]}
                      onPatch={studio.patchDraft}
                    />
                  ))}
                  {sectionId === "signatures" ? <SignatureEditor studio={studio} /> : null}
                </div>
              ) : null}
            </details>
          );
        })}
      </div>
    </section>
  );
};

export default ReportLayoutInspector;
