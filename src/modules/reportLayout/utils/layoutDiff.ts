import type { TFunction } from "i18next";
import type { TLayoutDraft, TSignatureDraft } from "../types";
import { LAYOUT_FIELDS, type TLayoutField } from "./layoutFields";
import { layoutText } from "./layoutText";

export type TLayoutChange = {
  label: string;
  from: string;
  to: string;
};

const sameValue = (field: TLayoutField, left: unknown, right: unknown) => {
  if (field.kind === "number") return Number(left) === Number(right);
  return (left ?? "") === (right ?? "");
};

const displayValue = (field: TLayoutField, value: unknown, t: TFunction) => {
  if (value === null || value === undefined || value === "") {
    return t("reportLayout.diff.auto");
  }
  if (field.kind === "bool") {
    return value ? t("reportLayout.diff.on") : t("reportLayout.diff.off");
  }
  if (field.kind === "select") {
    return layoutText(
      t,
      `reportLayout.options.${field.options}.${String(value)}`,
    );
  }
  return String(value).replace(/\s+/g, " ").slice(0, 28);
};

const signatureText = (signatures: TSignatureDraft[]) =>
  signatures
    .map((signature) =>
      [
        signature.label,
        signature.title,
        signature.name,
        signature.align,
        signature.displayOrder,
        signature.widthMm,
        signature.heightMm,
        signature.dateLabel,
        signature.imageUrl,
        signature.instructions,
        signature.isSignature,
        signature.showNameLine,
        signature.showDateLine,
        signature.repeatOnEveryPage,
      ].join("|"),
    )
    .join("~");

export const buildLayoutChanges = (
  baseline: TLayoutDraft | null,
  draft: TLayoutDraft,
  t: TFunction,
): TLayoutChange[] => {
  if (!baseline) return [];

  const changes: TLayoutChange[] = [];

  LAYOUT_FIELDS.forEach((field) => {
    const from = baseline[field.key];
    const to = draft[field.key];
    if (sameValue(field, from, to)) return;
    changes.push({
      label: layoutText(t, field.labelKey),
      from: displayValue(field, from, t),
      to: displayValue(field, to, t),
    });
  });

  if (signatureText(baseline.signatures) !== signatureText(draft.signatures)) {
    changes.push({
      label: t("reportLayout.fields.signatures"),
      from: t("reportLayout.diff.blocks", { count: baseline.signatures.length }),
      to: t("reportLayout.diff.blocks", { count: draft.signatures.length }),
    });
  }

  return changes;
};
