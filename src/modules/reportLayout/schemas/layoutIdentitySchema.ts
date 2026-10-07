import type { TFunction } from "i18next";
import { z } from "zod";
import { LAYOUT_LIMITS } from "./layoutLimits";

export const createLayoutSaveSchema = (
  t: TFunction,
  takenCodes: ReadonlyMap<string, string>,
) =>
  z
    .object({
      code: z
        .string()
        .trim()
        .min(1, t("reportLayout.checks.codeRequired"))
        .max(
          LAYOUT_LIMITS.code,
          t("reportLayout.checks.tooLong", {
            field: t("reportLayout.save.code"),
            max: LAYOUT_LIMITS.code,
          }),
        ),
      name: z
        .string()
        .trim()
        .min(1, t("reportLayout.checks.nameRequired"))
        .max(
          LAYOUT_LIMITS.name,
          t("reportLayout.checks.tooLong", {
            field: t("reportLayout.save.name"),
            max: LAYOUT_LIMITS.name,
          }),
        ),
      isDefault: z.boolean(),
    })
    .superRefine((values, ctx) => {
      const owner = takenCodes.get(values.code);
      if (!owner) return;
      ctx.addIssue({
        code: "custom",
        path: ["code"],
        message: t("reportLayout.checks.duplicateCode", {
          code: values.code,
          name: owner,
        }),
      });
    });

export type TLayoutSaveValues = z.infer<ReturnType<typeof createLayoutSaveSchema>>;
