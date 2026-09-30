import type { TSimpleResult } from "@/modules/authentication/types";

export type TUpdateLanguageRequest = {
  language: string;
};

export type TUpdateThemeRequest = {
  theme: string;
};

export type TUpdateLanguageResponse = TSimpleResult;
export type TUpdateThemeResponse = TSimpleResult;
