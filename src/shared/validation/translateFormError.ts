import type { TFunction } from "i18next";
import type { ValidationKey } from "./validationKeys";

export const translateFormError = (
  errorMessage: string | undefined,
  t: TFunction,
): string | undefined => {
  if (!errorMessage) {
    return undefined;
  }

  if (errorMessage.startsWith("validation.")) {
    return t(errorMessage as ValidationKey);
  }

  return errorMessage;
};
