import { LAYOUT_LIMITS } from "../schemas/layoutLimits";
import type {
  TLayout,
  TLayoutDraft,
  TLayoutInput,
  TSignature,
  TSignatureDraft,
} from "../types";
import { createBlankDraft, createLayoutUid, createSignature } from "./layoutDefaults";

const emptyToNull = (value: string | null | undefined) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

const asSignature = (signature: TSignatureDraft, index: number): TSignature => ({
  label: signature.label.trim(),
  title: emptyToNull(signature.title),
  name: emptyToNull(signature.name),
  instructions: emptyToNull(signature.instructions),
  imageUrl: emptyToNull(signature.imageUrl),
  isSignature: signature.isSignature,
  repeatOnEveryPage: signature.repeatOnEveryPage,
  displayOrder: index + 1,
  align: signature.align,
  widthMm: signature.widthMm,
  heightMm: signature.heightMm,
  showDateLine: signature.showDateLine,
  dateLabel: emptyToNull(signature.dateLabel) ?? "Date",
  showNameLine: signature.showNameLine,
});

export const toLayoutInput = (draft: TLayoutDraft): TLayoutInput => ({
  code: draft.code.trim().slice(0, LAYOUT_LIMITS.code),
  name: draft.name.trim().slice(0, LAYOUT_LIMITS.name),
  description: emptyToNull(draft.description),
  isDefault: draft.isDefault,
  isActive: draft.isActive,
  defaultContentTemplateKey: draft.defaultContentTemplateKey ?? "Table",
  defaultTitle: emptyToNull(draft.defaultTitle),
  defaultSubtitle: emptyToNull(draft.defaultSubtitle),
  paperSize: draft.paperSize,
  orientation: draft.orientation,
  direction: draft.direction,
  marginTopMm: draft.marginTopMm,
  marginBottomMm: draft.marginBottomMm,
  marginLeftMm: draft.marginLeftMm,
  marginRightMm: draft.marginRightMm,
  pageBackgroundColor: emptyToNull(draft.pageBackgroundColor) ?? "#FFFFFF",
  fontFamily: emptyToNull(draft.fontFamily) ?? "Segoe UI",
  baseFontSizePt: draft.baseFontSizePt,
  primaryColor: emptyToNull(draft.primaryColor) ?? "#1F4E79",
  secondaryColor: emptyToNull(draft.secondaryColor) ?? "#5B9BD5",
  accentColor: emptyToNull(draft.accentColor) ?? "#F2F2F2",
  showTitleBand: draft.showTitleBand,
  titleAlign: draft.titleAlign,
  titleFontFamily: emptyToNull(draft.titleFontFamily),
  titleFontSizePt: draft.titleFontSizePt,
  titleFontColor: emptyToNull(draft.titleFontColor),
  showHeader: draft.showHeader,
  repeatHeaderOnEveryPage: draft.repeatHeaderOnEveryPage,
  showHeaderBorder: draft.showHeaderBorder,
  headerHeightMm: draft.headerHeightMm,
  headerFontSizePt: draft.headerFontSizePt,
  headerFontFamily: emptyToNull(draft.headerFontFamily),
  headerBackgroundColor: emptyToNull(draft.headerBackgroundColor),
  headerBorderColor: emptyToNull(draft.headerBorderColor),
  headerFontColor: emptyToNull(draft.headerFontColor),
  headerLeftText: emptyToNull(draft.headerLeftText),
  headerCenterText: emptyToNull(draft.headerCenterText),
  headerRightText: emptyToNull(draft.headerRightText),
  showLogo: draft.showLogo,
  logoUrl: emptyToNull(draft.logoUrl),
  logoPosition: draft.logoPosition,
  logoWidthMm: draft.logoWidthMm,
  logoHeightMm: draft.logoHeightMm,
  tableHeaderBackgroundColor:
    emptyToNull(draft.tableHeaderBackgroundColor) ?? "#1F4E79",
  tableHeaderFontColor: emptyToNull(draft.tableHeaderFontColor) ?? "#FFFFFF",
  tableHeaderFontSizePt: draft.tableHeaderFontSizePt,
  tableHeaderBold: draft.tableHeaderBold,
  tableRowBackgroundColor: emptyToNull(draft.tableRowBackgroundColor) ?? "#FFFFFF",
  tableAltRowBackgroundColor:
    emptyToNull(draft.tableAltRowBackgroundColor) ?? "#F2F2F2",
  tableBorderColor: emptyToNull(draft.tableBorderColor) ?? "#D0D0D0",
  showTableGridLines: draft.showTableGridLines,
  tableCellPaddingMm: draft.tableCellPaddingMm,
  showFooter: draft.showFooter,
  repeatFooterOnEveryPage: draft.repeatFooterOnEveryPage,
  showFooterBorder: draft.showFooterBorder,
  footerHeightMm: draft.footerHeightMm,
  footerFontSizePt: draft.footerFontSizePt,
  footerFontFamily: emptyToNull(draft.footerFontFamily),
  footerBackgroundColor: emptyToNull(draft.footerBackgroundColor),
  footerBorderColor: emptyToNull(draft.footerBorderColor),
  footerFontColor: emptyToNull(draft.footerFontColor),
  footerLeftText: emptyToNull(draft.footerLeftText),
  footerCenterText: emptyToNull(draft.footerCenterText),
  footerRightText: emptyToNull(draft.footerRightText),
  showPageNumbers: draft.showPageNumbers,
  pageNumberFormat:
    emptyToNull(draft.pageNumberFormat) ?? "{current} / {total}",
  pageNumberAlign: draft.pageNumberAlign,
  showGeneratedAt: draft.showGeneratedAt,
  generatedAtLabel: emptyToNull(draft.generatedAtLabel) ?? "Generated at",
  generatedAtFormat: emptyToNull(draft.generatedAtFormat) ?? "yyyy-MM-dd HH:mm",
  showWatermark: draft.showWatermark,
  watermarkText: emptyToNull(draft.watermarkText),
  watermarkColor: emptyToNull(draft.watermarkColor) ?? "#E0E0E0",
  watermarkOpacity: draft.watermarkOpacity,
  watermarkFontSizePt: draft.watermarkFontSizePt,
  showSignatureBorder: draft.showSignatureBorder,
  signatures: draft.signatures.map(asSignature),
});

const withSignatureUids = (signatures: TSignature[]): TSignatureDraft[] =>
  signatures.map((signature, index) => ({
    ...createSignature(signature.displayOrder || index + 1),
    ...signature,
    uid: createLayoutUid(),
  }));

const layoutMetaKeys = [
  "id",
  "companyId",
  "isSystem",
  "createdAtUtc",
  "updatedAtUtc",
] as const;

export const toStoredLayoutInput = (layout: TLayout): TLayoutInput => {
  const stored: TLayoutInput & Partial<Pick<TLayout, (typeof layoutMetaKeys)[number]>> = {
    ...layout,
  };
  layoutMetaKeys.forEach((key) => {
    delete stored[key];
  });
  return stored;
};

export const toDraft = (
  source: Partial<TLayoutInput> | TLayout,
): TLayoutDraft => {
  const blank = createBlankDraft();
  const {
    signatures,
    ...fields
  } = source;

  return {
    ...blank,
    ...fields,
    signatures: withSignatureUids(signatures ?? []),
  };
};

export const companyLayouts = (layouts: TLayout[]) =>
  layouts.filter((layout) => !layout.isSystem);

const codeWithSuffix = (stem: string, suffix: string, max: number) => {
  if (max <= 0) return "";
  const ending = suffix.length >= max ? suffix.slice(-max) : suffix;
  return `${stem.slice(0, max - ending.length)}${ending}`;
};

export const nextFreeCode = (seed: string, layouts: TLayout[]) => {
  const taken = new Set(companyLayouts(layouts).map((layout) => layout.code));
  const max = LAYOUT_LIMITS.code;
  const stem = (seed.trim() || "TENANT_CUSTOM").replace(/_\d+$/, "") || "TENANT_CUSTOM";
  const base = stem.slice(0, max);
  if (!taken.has(base)) return base;

  for (let index = 2; index < 10000; index += 1) {
    const candidate = codeWithSuffix(stem, `_${index}`, max);
    if (!taken.has(candidate)) return candidate;
  }

  return codeWithSuffix("LAYOUT", String(Date.now()), max);
};

export const suffixCopy = (value: string, max: number, suffix: string) =>
  codeWithSuffix(value.trim(), suffix, max);
