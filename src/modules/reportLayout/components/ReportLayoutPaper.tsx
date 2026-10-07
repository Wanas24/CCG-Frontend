import { memo, type CSSProperties, type ReactNode } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { TContentKind, TLayoutDraft, TSignatureDraft, TTextAlign } from "../types";
import {
  colorOr,
  footerBandMm,
  hexToRgba,
  MM_PER_PT,
  paperSizeMm,
  PDF_FOOTER_TEXT_FALLBACK,
  PDF_MUTED_TEXT,
  PDF_PAGE_FALLBACK,
  PDF_PRIMARY_FALLBACK,
  safeMediaUrl,
} from "../utils/paperGeometry";

const SAMPLE_ROWS = [
  ["PRJ-1001", "North Tower", "Acme Co", "Active", "250,000"],
  ["PRJ-1002", "Harbor Mall", "Blue Star", "Pending", "287,500"],
  ["PRJ-1003", "City Clinic", "MedGroup", "Closed", "325,000"],
  ["PRJ-1004", "West Road", "BuildPro", "On Hold", "362,500"],
  ["PRJ-1005", "East Bridge", "Urban Dev", "Active", "400,000"],
  ["PRJ-1006", "Green Park", "GreenLeaf", "Pending", "437,500"],
  ["PRJ-1007", "Skyline Plaza", "SkyLine Inc", "Closed", "475,000"],
  ["PRJ-1008", "Desert Oasis", "Desert Co", "Active", "512,500"],
];

type Props = {
  draft: TLayoutDraft;
  sampleTitle: string;
  sampleSubtitle: string;
  contentKind: TContentKind;
  guides: boolean;
  pxPerMm: number;
  showCaptions: boolean;
  maxPages: 1 | 2;
};

const alignOf = (align: TTextAlign): CSSProperties["textAlign"] => {
  if (align === 1) return "left";
  if (align === 3) return "right";
  return "center";
};

const formatStamp = (pattern: string | null | undefined) => {
  const mapped = (pattern || "yyyy-MM-dd HH:mm")
    .replace(/yyyy/g, "YYYY")
    .replace(/dd/g, "DD");
  return dayjs().format(mapped);
};

const expandText = (
  value: string | null | undefined,
  context: { title: string; subtitle: string; stamp: string },
) =>
  (value ?? "").replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_match, key: string) => {
    switch (key.toLowerCase()) {
      case "title":
        return context.title;
      case "subtitle":
        return context.subtitle;
      case "date":
      case "generatedat":
      case "generated_at":
        return context.stamp;
      default:
        return "";
    }
  });

const rowCapacity = (draft: TLayoutDraft, firstPage: boolean) => {
  const rowMm =
    draft.baseFontSizePt * MM_PER_PT * 1.5 + 2 * draft.tableCellPaddingMm + 0.7;
  const headMm =
    draft.tableHeaderFontSizePt * MM_PER_PT * 1.5 +
    2 * draft.tableCellPaddingMm +
    0.7;
  const [, height] = paperSizeMm(draft);
  const headerBand =
    draft.showHeader && draft.repeatHeaderOnEveryPage ? draft.headerHeightMm : 0;
  let free =
    height -
    draft.marginTopMm -
    headerBand -
    draft.marginBottomMm -
    footerBandMm(draft) -
    headMm -
    4;
  if (firstPage) {
    if (draft.showHeader && !draft.repeatHeaderOnEveryPage) {
      free -= draft.headerHeightMm;
    }
    if (draft.showTitleBand) free -= draft.titleFontSizePt * MM_PER_PT * 1.6 + 6;
  }
  return Math.max(1, Math.floor(free / Math.max(2, rowMm)));
};

const SignatureRow = ({
  draft,
  signatures,
  px,
  fontSizePt,
}: {
  draft: TLayoutDraft;
  signatures: TSignatureDraft[];
  px: (mm: number) => number;
  fontSizePt: number;
}) => {
  if (signatures.length === 0) return null;
  return (
    <table
      className="w-full border-collapse"
      style={{ marginTop: px(3), fontSize: fontSizePt * MM_PER_PT * (px(1) / 1) }}
    >
      <tbody>
        <tr>
          {signatures.map((signature) => {
            const image = safeMediaUrl(signature.imageUrl);
            return (
              <td
                key={signature.uid}
                className="align-top whitespace-pre-wrap"
                style={{
                  width: `${100 / signatures.length}%`,
                  textAlign: alignOf(signature.align),
                  padding: px(2),
                  border: draft.showSignatureBorder
                    ? "1px solid var(--Grey300)"
                    : undefined,
                  fontSize: px(fontSizePt * MM_PER_PT),
                }}
              >
                {signature.label ? (
                  <div className="font-bold" style={{ marginBottom: px(1) }}>
                    {signature.label}
                  </div>
                ) : null}
                {signature.title ? (
                  <div style={{ marginBottom: px(1), color: PDF_FOOTER_TEXT_FALLBACK }}>
                    {signature.title}
                  </div>
                ) : null}
                {image ? (
                  <img
                    src={image}
                    alt=""
                    style={{
                      maxWidth: px(signature.widthMm),
                      maxHeight: px(signature.heightMm),
                    }}
                  />
                ) : signature.isSignature ? (
                  <div
                    style={{
                      height: px(signature.heightMm),
                      borderBottom: "1px solid var(--Grey700)",
                      margin: `${px(2)}px auto ${px(1)}px`,
                    }}
                  />
                ) : null}
                {signature.showNameLine ? (
                  <div style={{ marginTop: px(1) }}>
                    {signature.name?.trim() || "________________"}
                  </div>
                ) : null}
                {signature.showDateLine ? (
                  <div style={{ marginTop: px(1), color: PDF_FOOTER_TEXT_FALLBACK }}>
                    {signature.dateLabel?.trim() || "Date"}: ______________
                  </div>
                ) : null}
                {signature.instructions ? (
                  <div
                    style={{
                      marginTop: px(1),
                      color: "var(--Grey500)",
                      fontSize: px(8 * MM_PER_PT),
                    }}
                  >
                    {signature.instructions}
                  </div>
                ) : null}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
};

const ChromeTable = ({
  left,
  center,
  right,
  logoUrl,
  logoPosition,
  logoWidth,
  logoHeight,
}: {
  left: string;
  center: string;
  right: string;
  logoUrl: string | null;
  logoPosition: TTextAlign;
  logoWidth: number;
  logoHeight: number;
}) => {
  const cell = (text: string, align: TTextAlign, position: TTextAlign) => (
    <td
      className="w-1/3 whitespace-pre-wrap align-middle"
      style={{ textAlign: alignOf(align), padding: "0 4px" }}
    >
      {logoUrl && logoPosition === position ? (
        <img
          src={logoUrl}
          alt=""
          style={{
            display: "inline-block",
            maxWidth: logoWidth,
            maxHeight: logoHeight,
          }}
        />
      ) : null}
      {text ? <div>{text}</div> : null}
    </td>
  );

  return (
    <table className="h-full w-full table-fixed border-collapse">
      <tbody>
        <tr>
          {cell(left, 1, 1)}
          {cell(center, 2, 2)}
          {cell(right, 3, 3)}
        </tr>
      </tbody>
    </table>
  );
};

const ReportLayoutPaper = ({
  draft,
  sampleTitle,
  sampleSubtitle,
  contentKind,
  guides,
  pxPerMm,
  showCaptions,
  maxPages,
}: Props) => {
  const { t } = useTranslation();
  const px = (mm: number) => mm * pxPerMm;
  const [widthMm, heightMm] = paperSizeMm(draft);
  const primary = colorOr(draft.primaryColor, PDF_PRIMARY_FALLBACK);
  const title = sampleTitle.trim() || draft.defaultTitle?.trim() || draft.name || t("reportLayout.canvas.sampleTitle");
  const subtitle = sampleSubtitle.trim() || draft.defaultSubtitle?.trim() || "";
  const stamp = formatStamp(draft.generatedAtFormat);
  const context = { title, subtitle, stamp };
  const bodyFont = draft.fontFamily?.trim() || "Segoe UI";
  const titleFont = draft.titleFontFamily?.trim() || bodyFont;
  const headerFont = draft.headerFontFamily?.trim() || bodyFont;
  const footerFont = draft.footerFontFamily?.trim() || bodyFont;
  const headerBg = draft.headerBackgroundColor?.trim() || "transparent";
  const headerFg = colorOr(draft.headerFontColor, primary);
  const headerBorder = colorOr(draft.headerBorderColor, primary);
  const footerBg = draft.footerBackgroundColor?.trim() || "transparent";
  const footerFg = colorOr(draft.footerFontColor, PDF_FOOTER_TEXT_FALLBACK);
  const footerBorder = colorOr(draft.footerBorderColor, primary);
  const titleColor = colorOr(draft.titleFontColor, primary);
  const logo = draft.showLogo ? safeMediaUrl(draft.logoUrl) : null;
  const logoHeight = Math.min(draft.logoHeightMm || 18, draft.headerHeightMm || 25);
  const footerBand = footerBandMm(draft);
  const repeatingHeader = draft.showHeader && draft.repeatHeaderOnEveryPage;
  const contentTop = draft.marginTopMm + (repeatingHeader ? draft.headerHeightMm : 0);
  const contentMm = Math.max(0, heightMm - contentTop - draft.marginBottomMm - footerBand);
  const cap1 = rowCapacity(draft, true);
  const cap2 = rowCapacity(draft, false);
  const pages = maxPages;
  const pageRows = [
    SAMPLE_ROWS.slice(0, cap1),
    SAMPLE_ROWS.slice(cap1, cap1 + cap2),
  ];
  let leftover = SAMPLE_ROWS.length - cap1 - (pages > 1 ? cap2 : 0);
  let extraPages = 0;
  while (leftover > 0 && extraPages < 8) {
    extraPages += 1;
    leftover -= cap2;
  }
  const columns = [
    t("reportLayout.sample.code"),
    t("reportLayout.sample.project"),
    t("reportLayout.sample.client"),
    t("reportLayout.sample.status"),
    t("reportLayout.sample.budget"),
  ];

  const renderHeader = () => (
    <ChromeTable
      left={expandText(draft.headerLeftText, context)}
      center={expandText(draft.headerCenterText, context) || title}
      right={expandText(draft.headerRightText, context)}
      logoUrl={logo}
      logoPosition={draft.logoPosition}
      logoWidth={px(draft.logoWidthMm)}
      logoHeight={px(logoHeight)}
    />
  );

  const footerNode = (pageNumber: number) => {
    let left = expandText(draft.footerLeftText, context);
    let center = expandText(draft.footerCenterText, context);
    let right = draft.showGeneratedAt
      ? `${draft.generatedAtLabel?.trim() || ""} ${stamp}`.trim()
      : expandText(draft.footerRightText, context);
    if (draft.showPageNumbers) {
      const format = draft.pageNumberFormat || "{current} / {total}";
      const counters = draft.repeatFooterOnEveryPage
        ? format.replace(/\{current\}/gi, String(pageNumber)).replace(/\{total\}/gi, "2")
        : format.replace(/\{current\}/gi, "1").replace(/\{total\}/gi, "N");
      const join = (text: string) => (text ? `${text}  ${counters}` : counters);
      if (draft.pageNumberAlign === 1) left = join(left);
      else if (draft.pageNumberAlign === 3) right = join(right);
      else center = join(center);
    }
    return <ChromeTable left={left} center={center} right={right} logoUrl={null} logoPosition={2} logoWidth={0} logoHeight={0} />;
  };

  const renderPage = (pageNumber: number) => {
    const isFirst = pageNumber === 1;
    const isLast = pageNumber === pages;
    const rows = contentKind === 1 ? pageRows[pageNumber - 1] ?? [] : [];
    let body: ReactNode;
    if (contentKind === 2) {
      body = isFirst ? (
        <div className="whitespace-pre-wrap" style={{ padding: px(2) }}>
          {t("reportLayout.sample.text")}
        </div>
      ) : null;
    } else {
      const border = draft.showTableGridLines
        ? `1px solid ${colorOr(draft.tableBorderColor, "var(--Grey300)")}`
        : "none";
      body = (
        <table className="w-full table-fixed border-collapse" style={{ fontSize: px(draft.baseFontSizePt * MM_PER_PT) }}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  style={{
                    background: colorOr(draft.tableHeaderBackgroundColor, primary),
                    color: colorOr(draft.tableHeaderFontColor, PDF_PAGE_FALLBACK),
                    fontSize: px(draft.tableHeaderFontSizePt * MM_PER_PT),
                    fontWeight: draft.tableHeaderBold ? 700 : 400,
                    border,
                    padding: px(draft.tableCellPaddingMm),
                    textAlign: "start",
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row[0]}>
                {row.map((cell) => (
                  <td
                    key={cell}
                    className="align-top"
                    style={{
                      background:
                        index % 2 === 0
                          ? colorOr(draft.tableRowBackgroundColor, PDF_PAGE_FALLBACK)
                          : colorOr(draft.tableAltRowBackgroundColor, "var(--Grey100)"),
                      border,
                      padding: px(draft.tableCellPaddingMm),
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    const bodySignatures = draft.signatures.filter((signature) => !signature.repeatOnEveryPage);
    const repeatingSignatures = draft.signatures.filter((signature) => signature.repeatOnEveryPage);

    return (
      <div key={pageNumber} className="flex flex-col items-center gap-1.5">
        {showCaptions ? (
          <span className="text-[11px] font-bold tracking-wide text-(--Grey500) uppercase">
            {t("reportLayout.canvas.page", { page: pageNumber, total: pages })}
          </span>
        ) : null}
        <div
          className="relative overflow-hidden shadow-lg"
          style={{
            width: px(widthMm),
            height: px(heightMm),
            background: colorOr(draft.pageBackgroundColor, PDF_PAGE_FALLBACK),
            color: "var(--Grey900)",
            direction: draft.direction === 2 ? "rtl" : "ltr",
            fontFamily: bodyFont,
            fontSize: px(draft.baseFontSizePt * MM_PER_PT),
          }}
        >
          {guides ? (
            <div
              className="pointer-events-none absolute border border-dashed border-(--Primary400)"
              style={{
                top: px(draft.marginTopMm),
                bottom: px(draft.marginBottomMm),
                left: px(draft.marginLeftMm),
                right: px(draft.marginRightMm),
              }}
            />
          ) : null}
          {repeatingHeader ? (
            <div
              className="absolute overflow-hidden"
              style={{
                top: px(draft.marginTopMm),
                left: px(draft.marginLeftMm),
                right: px(draft.marginRightMm),
                height: px(draft.headerHeightMm),
                background: headerBg,
                color: headerFg,
                fontFamily: headerFont,
                fontSize: px(draft.headerFontSizePt * MM_PER_PT),
                borderBottom: draft.showHeaderBorder ? `1px solid ${headerBorder}` : undefined,
              }}
            >
              {renderHeader()}
            </div>
          ) : null}
          <div
            className="absolute overflow-hidden"
            style={{
              top: px(contentTop),
              left: px(draft.marginLeftMm),
              right: px(draft.marginRightMm),
              height: px(contentMm),
            }}
          >
            {draft.showHeader && !draft.repeatHeaderOnEveryPage && isFirst ? (
              <div
                className="overflow-hidden"
                style={{
                  height: px(draft.headerHeightMm),
                  background: headerBg,
                  color: headerFg,
                  fontFamily: headerFont,
                  fontSize: px(draft.headerFontSizePt * MM_PER_PT),
                  borderBottom: draft.showHeaderBorder ? `1px solid ${headerBorder}` : undefined,
                }}
              >
                {renderHeader()}
              </div>
            ) : null}
            {draft.showTitleBand && isFirst ? (
              <div style={{ textAlign: alignOf(draft.titleAlign), color: titleColor, fontFamily: titleFont }}>
                <div className="font-bold" style={{ fontSize: px(draft.titleFontSizePt * MM_PER_PT) }}>
                  {title}
                </div>
                {subtitle ? (
                  <div className="whitespace-pre-wrap" style={{ color: PDF_MUTED_TEXT, marginBottom: px(4) }}>
                    {subtitle}
                  </div>
                ) : null}
              </div>
            ) : null}
            {body}
            {isLast && bodySignatures.length > 0 ? (
              <SignatureRow draft={draft} signatures={bodySignatures} px={px} fontSizePt={draft.baseFontSizePt} />
            ) : null}
            {isLast && draft.showFooter && !draft.repeatFooterOnEveryPage ? (
              <div
                style={{
                  marginTop: px(4),
                  color: footerFg,
                  background: footerBg,
                  fontFamily: footerFont,
                  fontSize: px(draft.footerFontSizePt * MM_PER_PT),
                  borderTop: draft.showFooterBorder ? `1px solid ${footerBorder}` : undefined,
                }}
              >
                {footerNode(pageNumber)}
              </div>
            ) : null}
          </div>
          {footerBand > 0 ? (
            <div
              className="absolute overflow-hidden"
              style={{
                bottom: px(draft.marginBottomMm),
                left: px(draft.marginLeftMm),
                right: px(draft.marginRightMm),
                height: px(footerBand),
                background: footerBg,
                color: footerFg,
                fontFamily: footerFont,
                fontSize: px(draft.footerFontSizePt * MM_PER_PT),
                borderTop:
                  draft.showFooter && draft.showFooterBorder
                    ? `1px solid ${footerBorder}`
                    : undefined,
              }}
            >
              {draft.showFooter && draft.repeatFooterOnEveryPage ? footerNode(pageNumber) : null}
              {repeatingSignatures.length > 0 ? (
                <SignatureRow
                  draft={draft}
                  signatures={repeatingSignatures}
                  px={px}
                  fontSizePt={draft.footerFontSizePt}
                />
              ) : null}
            </div>
          ) : null}
          {draft.showWatermark && draft.watermarkText?.trim() ? (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <span
                className="-rotate-[32deg] text-center font-bold whitespace-pre-wrap"
                style={{
                  fontSize: px(draft.watermarkFontSizePt * MM_PER_PT),
                  color: hexToRgba(draft.watermarkColor, draft.watermarkOpacity),
                  fontFamily: bodyFont,
                }}
              >
                {draft.watermarkText}
              </span>
            </div>
          ) : null}
          {guides && pxPerMm > 1.4 ? (
            <>
              <span className="pointer-events-none absolute top-0.5 left-1/2 -translate-x-1/2 bg-(--app-surface) px-1 text-[8px] font-semibold text-(--Primary400)">
                {t("reportLayout.canvas.margin", { mm: draft.marginTopMm })}
              </span>
              {repeatingHeader ? (
                <span
                  className="pointer-events-none absolute bg-(--app-surface) px-1 text-[8px] font-semibold text-(--Primary400)"
                  style={{ top: px(draft.marginTopMm), left: px(draft.marginLeftMm + 1) }}
                >
                  {t("reportLayout.canvas.headerBand", { mm: draft.headerHeightMm })}
                </span>
              ) : null}
              {footerBand > 0 ? (
                <span
                  className="pointer-events-none absolute bg-(--app-surface) px-1 text-[8px] font-semibold text-(--Primary400)"
                  style={{ bottom: px(draft.marginBottomMm), left: px(draft.marginLeftMm + 1) }}
                >
                  {t("reportLayout.canvas.footerBand", { mm: Math.round(footerBand) })}
                </span>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {Array.from({ length: pages }, (_item, index) => renderPage(index + 1))}
      {showCaptions && contentKind === 1 && extraPages > 0 ? (
        <span className="text-xs text-(--Grey500)">
          {t("reportLayout.canvas.morePages", { count: extraPages })}
        </span>
      ) : null}
    </div>
  );
};

export default memo(ReportLayoutPaper);
