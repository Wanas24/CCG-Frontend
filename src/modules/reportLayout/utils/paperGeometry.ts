import type { TLayoutDraft } from "../types";

const PAPER_MM: Record<number, [number, number]> = {
  1: [210, 297],
  2: [297, 420],
  3: [215.9, 279.4],
  4: [215.9, 355.6],
};

export const MM_PER_PT = 25.4 / 72;

export const paperSizeMm = (draft: TLayoutDraft): [number, number] => {
  const [width, height] = PAPER_MM[draft.paperSize] ?? PAPER_MM[1];
  return draft.orientation === 2 ? [height, width] : [width, height];
};

export const footerBandMm = (draft: TLayoutDraft) => {
  const repeating = draft.signatures.filter((signature) => signature.repeatOnEveryPage);
  const chrome = draft.showFooter && draft.repeatFooterOnEveryPage;
  if (!chrome && repeating.length === 0) return 0;

  let height = draft.footerHeightMm > 0 ? draft.footerHeightMm : 20;
  if (!draft.showFooter && repeating.length > 0) {
    const tallest = Math.max(...repeating.map((signature) => signature.heightMm || 20));
    height = Math.max(height, tallest + 12);
  }
  return height;
};

export const contentRoomMm = (draft: TLayoutDraft) => {
  const [, height] = paperSizeMm(draft);
  const header = draft.showHeader ? draft.headerHeightMm : 0;
  return height - draft.marginTopMm - header - draft.marginBottomMm - footerBandMm(draft);
};

export const PDF_PRIMARY_FALLBACK = "#1F4E79";
export const PDF_FOOTER_TEXT_FALLBACK = "#475569";
export const PDF_MUTED_TEXT = "#666666";
export const PDF_PAGE_FALLBACK = "#FFFFFF";

export const colorOr = (value: string | null | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

export const hexToRgba = (hex: string | null | undefined, alpha: number) => {
  const raw = (hex ?? "").replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) {
    return `rgba(224,224,224,${alpha})`;
  }
  const red = Number.parseInt(raw.slice(0, 2), 16);
  const green = Number.parseInt(raw.slice(2, 4), 16);
  const blue = Number.parseInt(raw.slice(4, 6), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
};

export const safeMediaUrl = (value: string | null | undefined) => {
  const trimmed = value?.trim() ?? "";
  if (/^https?:\/\//i.test(trimmed) || /^data:image\//i.test(trimmed)) {
    return trimmed;
  }
  return null;
};
