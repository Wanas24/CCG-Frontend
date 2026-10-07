import type { TFunction } from "i18next";
import { LAYOUT_LIMITS } from "../schemas/layoutLimits";
import type { TContentKind, TLayout, TLayoutDraft } from "../types";
import { companyLayouts } from "./layoutPayload";
import { layoutText } from "./layoutText";
import { contentRoomMm } from "./paperGeometry";

export type TLayoutCheck = {
  level: "err" | "warn" | "info";
  text: string;
};

type TCheckInput = {
  draft: TLayoutDraft;
  layouts: TLayout[];
  editingId: string | null;
  editingIsSystem: boolean;
  contentKind: TContentKind;
  quotaUsed: number | null;
  quotaLimit: number | null;
  t: TFunction;
};

const textLength = (value: string | null | undefined) => value?.length ?? 0;

export const buildLayoutChecks = ({
  draft,
  layouts,
  editingId,
  editingIsSystem,
  contentKind,
  quotaUsed,
  quotaLimit,
  t,
}: TCheckInput): TLayoutCheck[] => {
  const checks: TLayoutCheck[] = [];
  const err = (text: string) => checks.push({ level: "err", text });
  const warn = (text: string) => checks.push({ level: "warn", text });
  const info = (text: string) => checks.push({ level: "info", text });

  const code = draft.code.trim();
  const name = draft.name.trim();

  if (!code) err(t("reportLayout.checks.codeRequired"));
  else if (code.length > LAYOUT_LIMITS.code) {
    err(t("reportLayout.checks.tooLong", { field: t("reportLayout.fields.code"), max: LAYOUT_LIMITS.code }));
  } else {
    const clash = companyLayouts(layouts).find(
      (layout) => layout.code === code && layout.id !== editingId,
    );
    if (clash) {
      err(t("reportLayout.checks.duplicateCode", { code, name: clash.name }));
    }
  }

  if (!name) err(t("reportLayout.checks.nameRequired"));
  else if (name.length > LAYOUT_LIMITS.name) {
    err(t("reportLayout.checks.tooLong", { field: t("reportLayout.fields.name"), max: LAYOUT_LIMITS.name }));
  }

  const lengths: Array<[string | null | undefined, number, string]> = [
    [draft.description, LAYOUT_LIMITS.description, "reportLayout.fields.description"],
    [draft.defaultTitle, LAYOUT_LIMITS.title, "reportLayout.fields.defaultTitle"],
    [draft.defaultSubtitle, LAYOUT_LIMITS.title, "reportLayout.fields.defaultSubtitle"],
    [draft.logoUrl, LAYOUT_LIMITS.logoUrl, "reportLayout.fields.logoUrl"],
    [draft.headerLeftText, LAYOUT_LIMITS.headerText, "reportLayout.fields.headerLeft"],
    [draft.headerCenterText, LAYOUT_LIMITS.headerText, "reportLayout.fields.headerCenter"],
    [draft.headerRightText, LAYOUT_LIMITS.headerText, "reportLayout.fields.headerRight"],
    [draft.footerLeftText, LAYOUT_LIMITS.headerText, "reportLayout.fields.footerLeft"],
    [draft.footerCenterText, LAYOUT_LIMITS.headerText, "reportLayout.fields.footerCenter"],
    [draft.footerRightText, LAYOUT_LIMITS.headerText, "reportLayout.fields.footerRight"],
    [draft.watermarkText, LAYOUT_LIMITS.watermarkText, "reportLayout.fields.watermarkText"],
    [draft.pageNumberFormat, LAYOUT_LIMITS.pageNumberFormat, "reportLayout.fields.pageNumberFormat"],
    [draft.generatedAtFormat, LAYOUT_LIMITS.pageNumberFormat, "reportLayout.fields.generatedAtFormat"],
    [draft.generatedAtLabel, LAYOUT_LIMITS.generatedAtLabel, "reportLayout.fields.generatedAtLabel"],
  ];

  lengths.forEach(([value, max, labelKey]) => {
    if (textLength(value) > max) {
      err(
        t("reportLayout.checks.tooLong", {
          field: layoutText(t, labelKey),
          max,
        }),
      );
    }
  });

  if (draft.watermarkOpacity < 0 || draft.watermarkOpacity > 1) {
    err(t("reportLayout.checks.opacity"));
  }

  draft.signatures.forEach((signature, index) => {
    if (!signature.label.trim()) {
      err(t("reportLayout.checks.signatureLabel", { index: index + 1 }));
    }
    if (signature.label.length > LAYOUT_LIMITS.signatureText) {
      err(t("reportLayout.checks.tooLong", { field: t("reportLayout.fields.signatureLabel"), max: LAYOUT_LIMITS.signatureText }));
    }
  });

  if (editingIsSystem) info(t("reportLayout.checks.systemReadOnly"));

  if (quotaUsed !== null && quotaLimit !== null && quotaUsed >= quotaLimit) {
    if (!editingId) {
      err(t("reportLayout.checks.quota", { count: quotaUsed, limit: quotaLimit }));
    } else {
      warn(t("reportLayout.checks.quotaSaveAsNew", { limit: quotaLimit }));
    }
  }

  if (draft.isDefault) {
    const current = companyLayouts(layouts).find((layout) => layout.isDefault);
    if (current && current.id !== editingId) {
      warn(t("reportLayout.checks.defaultTaken", { name: current.name }));
    }
  }

  if (!draft.isActive) warn(t("reportLayout.checks.inactive"));
  if (draft.showLogo && !draft.logoUrl?.trim()) warn(t("reportLayout.checks.logoMissing"));
  if (draft.showWatermark && !draft.watermarkText?.trim()) {
    warn(t("reportLayout.checks.watermarkMissing"));
  }
  if (draft.showFooter && draft.showGeneratedAt && draft.footerRightText?.trim()) {
    info(t("reportLayout.checks.generatedAtReplacesRight"));
  }
  if (draft.showHeader && !draft.headerCenterText?.trim()) {
    info(t("reportLayout.checks.headerCenterTitle"));
  }
  if (draft.showHeader && !draft.repeatHeaderOnEveryPage) {
    info(t("reportLayout.checks.headerOnce"));
  }
  if (draft.showFooter && !draft.repeatFooterOnEveryPage) {
    info(t("reportLayout.checks.footerOnce"));
  }
  if (!draft.showFooter && draft.signatures.some((signature) => signature.repeatOnEveryPage)) {
    info(t("reportLayout.checks.repeatingSignatures"));
  }
  if (draft.secondaryColor !== "#5B9BD5" || draft.accentColor !== "#F2F2F2") {
    info(t("reportLayout.checks.reservedColors"));
  }
  if (contentKind === 2 && draft.defaultContentTemplateKey === "Table") {
    info(t("reportLayout.checks.previewTemplateMismatch"));
  }

  const usable = contentRoomMm(draft);
  if (usable < 40) {
    warn(t("reportLayout.checks.tightPage", { mm: Math.max(0, Math.round(usable)) }));
  }

  return checks;
};
