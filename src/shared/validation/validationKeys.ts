import type en from "@/i18n/locales/en.json";

type ValidationMessages = (typeof en)["validation"];

export type ValidationKey = `validation.${keyof ValidationMessages & string}`;

export const VALIDATION = {
  required: "validation.required",
  email: "validation.email",
  passwordMin: "validation.passwordMin",
  passwordMatch: "validation.passwordMatch",
} as const satisfies Record<keyof ValidationMessages, ValidationKey>;
