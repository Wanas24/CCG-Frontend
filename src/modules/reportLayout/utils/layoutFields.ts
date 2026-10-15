import type { TLayoutDraft } from "../types";

export const SECTION_IDS = [
  "identity",
  "page",
  "title",
  "palette",
  "header",
  "table",
  "footer",
  "watermark",
  "signatures",
] as const;

export type TSectionId = (typeof SECTION_IDS)[number];

export type TFieldKind =
  | "text"
  | "area"
  | "number"
  | "color"
  | "bool"
  | "select"
  | "font"
  | "image";

export type TSelectKind =
  | "paper"
  | "orientation"
  | "direction"
  | "align"
  | "logo"
  | "content";

export type TLayoutField = {
  key: keyof TLayoutDraft;
  section: TSectionId;
  kind: TFieldKind;
  labelKey: string;
  helpKey?: string;
  whyKey?: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  nullable?: boolean;
  fullWidth?: boolean;
  mono?: boolean;
  tokens?: boolean;
  options?: TSelectKind;
  visible?: (draft: TLayoutDraft) => boolean;
  fallbackColor?: (draft: TLayoutDraft) => string | null;
};

export const LAYOUT_FIELDS: TLayoutField[] = [
  { key: "code", section: "identity", kind: "text", labelKey: "reportLayout.fields.code", required: true, maxLength: 100, mono: true, helpKey: "reportLayout.help.code" },
  { key: "name", section: "identity", kind: "text", labelKey: "reportLayout.fields.name", required: true, maxLength: 250 },
  { key: "description", section: "identity", kind: "area", labelKey: "reportLayout.fields.description", maxLength: 1000, fullWidth: true },
  { key: "defaultContentTemplateKey", section: "identity", kind: "select", options: "content", labelKey: "reportLayout.fields.contentTemplate", helpKey: "reportLayout.help.contentTemplate" },
  { key: "defaultTitle", section: "identity", kind: "text", labelKey: "reportLayout.fields.defaultTitle", maxLength: 500, helpKey: "reportLayout.help.defaultTitle" },
  { key: "defaultSubtitle", section: "identity", kind: "text", labelKey: "reportLayout.fields.defaultSubtitle", maxLength: 500 },
  { key: "isDefault", section: "identity", kind: "bool", labelKey: "reportLayout.fields.isDefault", fullWidth: true },
  { key: "isActive", section: "identity", kind: "bool", labelKey: "reportLayout.fields.isActive", fullWidth: true },

  { key: "paperSize", section: "page", kind: "select", options: "paper", labelKey: "reportLayout.fields.paper" },
  { key: "orientation", section: "page", kind: "select", options: "orientation", labelKey: "reportLayout.fields.orientation" },
  { key: "direction", section: "page", kind: "select", options: "direction", labelKey: "reportLayout.fields.direction", fullWidth: true, helpKey: "reportLayout.help.direction" },
  { key: "pageBackgroundColor", section: "page", kind: "color", labelKey: "reportLayout.fields.pageBackground" },
  { key: "fontFamily", section: "page", kind: "font", labelKey: "reportLayout.fields.fontFamily", maxLength: 100, helpKey: "reportLayout.help.fontFamily" },
  { key: "baseFontSizePt", section: "page", kind: "number", labelKey: "reportLayout.fields.baseFont", min: 4, max: 72, step: 0.5 },
  { key: "marginTopMm", section: "page", kind: "number", labelKey: "reportLayout.fields.marginTop", min: 0, max: 80, step: 1, helpKey: "reportLayout.help.marginTop" },
  { key: "marginBottomMm", section: "page", kind: "number", labelKey: "reportLayout.fields.marginBottom", min: 0, max: 80, step: 1 },
  { key: "marginLeftMm", section: "page", kind: "number", labelKey: "reportLayout.fields.marginLeft", min: 0, max: 80, step: 1 },
  { key: "marginRightMm", section: "page", kind: "number", labelKey: "reportLayout.fields.marginRight", min: 0, max: 80, step: 1 },

  { key: "showTitleBand", section: "title", kind: "bool", labelKey: "reportLayout.fields.showTitleBand", fullWidth: true },
  { key: "titleAlign", section: "title", kind: "select", options: "align", labelKey: "reportLayout.fields.titleAlign", visible: (draft) => draft.showTitleBand },
  { key: "titleFontSizePt", section: "title", kind: "number", labelKey: "reportLayout.fields.titleFontSize", min: 6, max: 90, step: 0.5, visible: (draft) => draft.showTitleBand },
  { key: "titleFontFamily", section: "title", kind: "font", labelKey: "reportLayout.fields.titleFont", maxLength: 100, nullable: true, helpKey: "reportLayout.help.emptyUsesPageFont", visible: (draft) => draft.showTitleBand },
  { key: "titleFontColor", section: "title", kind: "color", labelKey: "reportLayout.fields.titleColor", nullable: true, fallbackColor: (draft) => draft.primaryColor ?? null, helpKey: "reportLayout.help.autoPrimary", visible: (draft) => draft.showTitleBand },

  { key: "primaryColor", section: "palette", kind: "color", labelKey: "reportLayout.fields.primary", helpKey: "reportLayout.help.primary" },
  { key: "secondaryColor", section: "palette", kind: "color", labelKey: "reportLayout.fields.secondary", helpKey: "reportLayout.help.reservedColor" },
  { key: "accentColor", section: "palette", kind: "color", labelKey: "reportLayout.fields.accent", helpKey: "reportLayout.help.reservedColor" },

  { key: "showHeader", section: "header", kind: "bool", labelKey: "reportLayout.fields.showHeader", fullWidth: true },
  { key: "repeatHeaderOnEveryPage", section: "header", kind: "bool", labelKey: "reportLayout.fields.repeatHeader", fullWidth: true, helpKey: "reportLayout.help.repeatHeader", visible: (draft) => draft.showHeader },
  { key: "showHeaderBorder", section: "header", kind: "bool", labelKey: "reportLayout.fields.headerBorder", fullWidth: true, visible: (draft) => draft.showHeader },
  { key: "headerHeightMm", section: "header", kind: "number", labelKey: "reportLayout.fields.headerHeight", min: 0, max: 120, step: 1, visible: (draft) => draft.showHeader },
  { key: "headerFontSizePt", section: "header", kind: "number", labelKey: "reportLayout.fields.headerFontSize", min: 4, max: 48, step: 0.5, visible: (draft) => draft.showHeader },
  { key: "headerFontFamily", section: "header", kind: "font", labelKey: "reportLayout.fields.headerFont", maxLength: 100, nullable: true, helpKey: "reportLayout.help.emptyUsesPageFont", visible: (draft) => draft.showHeader },
  { key: "headerBackgroundColor", section: "header", kind: "color", labelKey: "reportLayout.fields.headerBackground", nullable: true, helpKey: "reportLayout.help.autoTransparent", visible: (draft) => draft.showHeader },
  { key: "headerBorderColor", section: "header", kind: "color", labelKey: "reportLayout.fields.headerBorderColor", nullable: true, fallbackColor: (draft) => draft.primaryColor ?? null, visible: (draft) => draft.showHeader && draft.showHeaderBorder },
  { key: "headerFontColor", section: "header", kind: "color", labelKey: "reportLayout.fields.headerTextColor", nullable: true, fallbackColor: (draft) => draft.primaryColor ?? null, visible: (draft) => draft.showHeader },
  { key: "headerLeftText", section: "header", kind: "area", labelKey: "reportLayout.fields.headerLeft", maxLength: 2000, tokens: true, fullWidth: true, visible: (draft) => draft.showHeader },
  { key: "headerCenterText", section: "header", kind: "area", labelKey: "reportLayout.fields.headerCenter", maxLength: 2000, tokens: true, fullWidth: true, helpKey: "reportLayout.help.headerCenter", visible: (draft) => draft.showHeader },
  { key: "headerRightText", section: "header", kind: "area", labelKey: "reportLayout.fields.headerRight", maxLength: 2000, tokens: true, fullWidth: true, visible: (draft) => draft.showHeader },
  { key: "showLogo", section: "header", kind: "bool", labelKey: "reportLayout.fields.showLogo", fullWidth: true, visible: (draft) => draft.showHeader },
  { key: "logoUrl", section: "header", kind: "image", labelKey: "reportLayout.fields.logoUrl", maxLength: 1000, fullWidth: true, helpKey: "reportLayout.help.logoUrl", visible: (draft) => draft.showHeader && draft.showLogo },
  { key: "logoPosition", section: "header", kind: "select", options: "logo", labelKey: "reportLayout.fields.logoPosition", visible: (draft) => draft.showHeader && draft.showLogo },
  { key: "logoWidthMm", section: "header", kind: "number", labelKey: "reportLayout.fields.logoWidth", min: 2, max: 150, step: 1, visible: (draft) => draft.showHeader && draft.showLogo },
  { key: "logoHeightMm", section: "header", kind: "number", labelKey: "reportLayout.fields.logoHeight", min: 2, max: 120, step: 1, helpKey: "reportLayout.help.logoHeight", visible: (draft) => draft.showHeader && draft.showLogo },

  { key: "tableHeaderBackgroundColor", section: "table", kind: "color", labelKey: "reportLayout.fields.tableHeaderBackground" },
  { key: "tableHeaderFontColor", section: "table", kind: "color", labelKey: "reportLayout.fields.tableHeaderText" },
  { key: "tableHeaderFontSizePt", section: "table", kind: "number", labelKey: "reportLayout.fields.tableHeaderFont", min: 4, max: 36, step: 0.5 },
  { key: "tableHeaderBold", section: "table", kind: "bool", labelKey: "reportLayout.fields.tableHeaderBold", fullWidth: true },
  { key: "tableRowBackgroundColor", section: "table", kind: "color", labelKey: "reportLayout.fields.tableRow" },
  { key: "tableAltRowBackgroundColor", section: "table", kind: "color", labelKey: "reportLayout.fields.tableAltRow" },
  { key: "tableBorderColor", section: "table", kind: "color", labelKey: "reportLayout.fields.tableBorder", visible: (draft) => draft.showTableGridLines },
  { key: "showTableGridLines", section: "table", kind: "bool", labelKey: "reportLayout.fields.tableGrid", fullWidth: true },
  { key: "tableCellPaddingMm", section: "table", kind: "number", labelKey: "reportLayout.fields.tablePadding", min: 0, max: 20, step: 0.5 },

  { key: "showFooter", section: "footer", kind: "bool", labelKey: "reportLayout.fields.showFooter", fullWidth: true, helpKey: "reportLayout.help.showFooter" },
  { key: "repeatFooterOnEveryPage", section: "footer", kind: "bool", labelKey: "reportLayout.fields.repeatFooter", fullWidth: true, helpKey: "reportLayout.help.repeatFooter", visible: (draft) => draft.showFooter },
  { key: "showFooterBorder", section: "footer", kind: "bool", labelKey: "reportLayout.fields.footerBorder", fullWidth: true, visible: (draft) => draft.showFooter },
  { key: "footerHeightMm", section: "footer", kind: "number", labelKey: "reportLayout.fields.footerHeight", min: 0, max: 120, step: 1 },
  { key: "footerFontSizePt", section: "footer", kind: "number", labelKey: "reportLayout.fields.footerFontSize", min: 4, max: 36, step: 0.5, helpKey: "reportLayout.help.footerFontSize" },
  { key: "footerFontFamily", section: "footer", kind: "font", labelKey: "reportLayout.fields.footerFont", maxLength: 100, nullable: true, helpKey: "reportLayout.help.emptyUsesPageFont", visible: (draft) => draft.showFooter },
  { key: "footerBackgroundColor", section: "footer", kind: "color", labelKey: "reportLayout.fields.footerBackground", nullable: true, helpKey: "reportLayout.help.autoTransparent", visible: (draft) => draft.showFooter },
  { key: "footerBorderColor", section: "footer", kind: "color", labelKey: "reportLayout.fields.footerBorderColor", nullable: true, fallbackColor: (draft) => draft.primaryColor ?? null, visible: (draft) => draft.showFooter && draft.showFooterBorder },
  { key: "footerFontColor", section: "footer", kind: "color", labelKey: "reportLayout.fields.footerTextColor", nullable: true, helpKey: "reportLayout.help.footerTextFallback", visible: (draft) => draft.showFooter },
  { key: "footerLeftText", section: "footer", kind: "area", labelKey: "reportLayout.fields.footerLeft", maxLength: 2000, tokens: true, fullWidth: true, visible: (draft) => draft.showFooter },
  { key: "footerCenterText", section: "footer", kind: "area", labelKey: "reportLayout.fields.footerCenter", maxLength: 2000, tokens: true, fullWidth: true, visible: (draft) => draft.showFooter },
  { key: "footerRightText", section: "footer", kind: "area", labelKey: "reportLayout.fields.footerRight", maxLength: 2000, tokens: true, fullWidth: true, whyKey: "reportLayout.help.footerRightIgnored", visible: (draft) => draft.showFooter && !draft.showGeneratedAt },
  { key: "showPageNumbers", section: "footer", kind: "bool", labelKey: "reportLayout.fields.pageNumbers", fullWidth: true, visible: (draft) => draft.showFooter },
  { key: "pageNumberFormat", section: "footer", kind: "text", labelKey: "reportLayout.fields.pageNumberFormat", maxLength: 50, mono: true, helpKey: "reportLayout.help.pageNumberFormat", visible: (draft) => draft.showFooter && draft.showPageNumbers },
  { key: "pageNumberAlign", section: "footer", kind: "select", options: "align", labelKey: "reportLayout.fields.pageNumberAlign", visible: (draft) => draft.showFooter && draft.showPageNumbers },
  { key: "showGeneratedAt", section: "footer", kind: "bool", labelKey: "reportLayout.fields.generatedAt", fullWidth: true, visible: (draft) => draft.showFooter },
  { key: "generatedAtLabel", section: "footer", kind: "text", labelKey: "reportLayout.fields.generatedAtLabel", maxLength: 100, visible: (draft) => draft.showFooter && draft.showGeneratedAt },
  { key: "generatedAtFormat", section: "footer", kind: "text", labelKey: "reportLayout.fields.generatedAtFormat", maxLength: 50, mono: true, helpKey: "reportLayout.help.generatedAtFormat", visible: (draft) => draft.showFooter && draft.showGeneratedAt },

  { key: "showWatermark", section: "watermark", kind: "bool", labelKey: "reportLayout.fields.showWatermark", fullWidth: true },
  { key: "watermarkText", section: "watermark", kind: "area", labelKey: "reportLayout.fields.watermarkText", maxLength: 1000, fullWidth: true, visible: (draft) => draft.showWatermark },
  { key: "watermarkColor", section: "watermark", kind: "color", labelKey: "reportLayout.fields.watermarkColor", visible: (draft) => draft.showWatermark },
  { key: "watermarkOpacity", section: "watermark", kind: "number", labelKey: "reportLayout.fields.watermarkOpacity", min: 0, max: 1, step: 0.05, visible: (draft) => draft.showWatermark },
  { key: "watermarkFontSizePt", section: "watermark", kind: "number", labelKey: "reportLayout.fields.watermarkFont", min: 6, max: 200, step: 1, visible: (draft) => draft.showWatermark },

  { key: "showSignatureBorder", section: "signatures", kind: "bool", labelKey: "reportLayout.fields.signatureBorder", fullWidth: true },
];

export const isFieldActive = (field: TLayoutField, draft: TLayoutDraft) =>
  field.visible ? field.visible(draft) : true;
