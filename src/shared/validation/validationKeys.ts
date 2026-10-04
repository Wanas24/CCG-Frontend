import type en from "@/i18n/en";

type ValidationMessages = (typeof en)["validation"];

export type ValidationKey = `validation.${keyof ValidationMessages & string}`;

export const VALIDATION = {
  required: "validation.required",
  email: "validation.email",
  passwordMin: "validation.passwordMin",
  passwordMatch: "validation.passwordMatch",
  passwordComplexity: "validation.passwordComplexity",
  maxLength50: "validation.maxLength50",
  maxLength200: "validation.maxLength200",
  maxLength500: "validation.maxLength500",
  phoneInvalid: "validation.phoneInvalid",
  nationalIdLength: "validation.nationalIdLength",
  dateOfBirthPast: "validation.dateOfBirthPast",
  imageType: "validation.imageType",
  imageMaxSize: "validation.imageMaxSize",
} as const satisfies Record<keyof ValidationMessages, ValidationKey>;
