export const PAPER_SIZE = {
  A4: 1,
  A3: 2,
  Letter: 3,
  Legal: 4,
} as const;

export const ORIENTATION = {
  Portrait: 1,
  Landscape: 2,
} as const;

export const TEXT_DIRECTION = {
  Ltr: 1,
  Rtl: 2,
} as const;

export const TEXT_ALIGN = {
  Left: 1,
  Center: 2,
  Right: 3,
} as const;

export const CONTENT_KIND = {
  Table: 1,
  PlainText: 2,
} as const;

export const CONTENT_TEMPLATE = {
  Table: "Table",
  Text: "Text",
} as const;

export type TPaperSize = (typeof PAPER_SIZE)[keyof typeof PAPER_SIZE];
export type TOrientation = (typeof ORIENTATION)[keyof typeof ORIENTATION];
export type TTextDirection = (typeof TEXT_DIRECTION)[keyof typeof TEXT_DIRECTION];
export type TTextAlign = (typeof TEXT_ALIGN)[keyof typeof TEXT_ALIGN];
export type TContentKind = (typeof CONTENT_KIND)[keyof typeof CONTENT_KIND];
export type TContentTemplate =
  (typeof CONTENT_TEMPLATE)[keyof typeof CONTENT_TEMPLATE];

export type TSignature = {
  id?: string | null;
  label: string;
  title?: string | null;
  name?: string | null;
  instructions?: string | null;
  imageUrl?: string | null;
  isSignature: boolean;
  repeatOnEveryPage: boolean;
  displayOrder: number;
  align: TTextAlign;
  widthMm: number;
  heightMm: number;
  showDateLine: boolean;
  dateLabel?: string | null;
  showNameLine: boolean;
};

export type TSignatureDraft = TSignature & {
  uid: string;
};

export type TLayoutInput = {
  code: string;
  name: string;
  description?: string | null;
  isDefault: boolean;
  isActive: boolean;
  defaultContentTemplateKey?: TContentTemplate | null;
  defaultTitle?: string | null;
  defaultSubtitle?: string | null;
  paperSize: TPaperSize;
  orientation: TOrientation;
  direction: TTextDirection;
  marginTopMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  marginRightMm: number;
  pageBackgroundColor?: string | null;
  fontFamily?: string | null;
  baseFontSizePt: number;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  showTitleBand: boolean;
  titleAlign: TTextAlign;
  titleFontFamily?: string | null;
  titleFontSizePt: number;
  titleFontColor?: string | null;
  showHeader: boolean;
  repeatHeaderOnEveryPage: boolean;
  showHeaderBorder: boolean;
  headerHeightMm: number;
  headerFontSizePt: number;
  headerFontFamily?: string | null;
  headerBackgroundColor?: string | null;
  headerBorderColor?: string | null;
  headerFontColor?: string | null;
  headerLeftText?: string | null;
  headerCenterText?: string | null;
  headerRightText?: string | null;
  showLogo: boolean;
  logoUrl?: string | null;
  logoPosition: TTextAlign;
  logoWidthMm: number;
  logoHeightMm: number;
  tableHeaderBackgroundColor?: string | null;
  tableHeaderFontColor?: string | null;
  tableHeaderFontSizePt: number;
  tableHeaderBold: boolean;
  tableRowBackgroundColor?: string | null;
  tableAltRowBackgroundColor?: string | null;
  tableBorderColor?: string | null;
  showTableGridLines: boolean;
  tableCellPaddingMm: number;
  showFooter: boolean;
  repeatFooterOnEveryPage: boolean;
  showFooterBorder: boolean;
  footerHeightMm: number;
  footerFontSizePt: number;
  footerFontFamily?: string | null;
  footerBackgroundColor?: string | null;
  footerBorderColor?: string | null;
  footerFontColor?: string | null;
  footerLeftText?: string | null;
  footerCenterText?: string | null;
  footerRightText?: string | null;
  showPageNumbers: boolean;
  pageNumberFormat: string;
  pageNumberAlign: TTextAlign;
  showGeneratedAt: boolean;
  generatedAtLabel?: string | null;
  generatedAtFormat?: string | null;
  showWatermark: boolean;
  watermarkText?: string | null;
  watermarkColor?: string | null;
  watermarkOpacity: number;
  watermarkFontSizePt: number;
  showSignatureBorder: boolean;
  signatures: TSignature[];
};

export type TLayoutDraft = Omit<TLayoutInput, "signatures"> & {
  signatures: TSignatureDraft[];
};

export type TLayout = TLayoutInput & {
  id: string;
  companyId: number | null;
  isSystem: boolean;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  signatures: TSignature[];
};

export type TPreviewInput = {
  title?: string | null;
  subtitle?: string | null;
  contentKind: TContentKind;
  layout: TLayoutInput;
  timeZoneId?: string | null;
};

export type TPreviewResult =
  | { ok: true; blob: Blob }
  | { ok: false; message: string };

export type TLastUsedResult =
  | { status: "found"; layout: TLayout }
  | { status: "empty" }
  | { status: "error"; message: string };

export type TReportLayoutSummary = {
  totalCount: number;
  companyCount: number;
  systemCount: number;
  activeCompanyCount: number;
  quotaLimit: number;
  defaultLayoutName: string | null;
  defaultLayoutCode: string | null;
  defaultIsSystem: boolean;
};

export const REPORT_TYPES = [
  "Projects",
  "Clients",
  "ProjectLocations",
  "ProjectResponsibleEngineers",
  "Boqs",
  "BoqItems",
] as const;

export type TReportType = (typeof REPORT_TYPES)[number];

export const LAYOUT_FONTS = [
  "Segoe UI",
  "Tahoma",
  "Arial",
  "Calibri",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Traditional Arabic",
  "Simplified Arabic",
  "Arial Unicode MS",
  "Noto Naskh Arabic",
  "Cairo",
  "Amiri",
] as const;

export const PLACEHOLDER_TOKENS = [
  "{{Title}}",
  "{{Subtitle}}",
  "{{Date}}",
  "{{Company}}",
] as const;
