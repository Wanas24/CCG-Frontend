import type { TSimpleResult } from "@/modules/authentication/types";
import i18n from "@/i18n/config";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const isSimpleResult = (value: unknown): value is TSimpleResult => {
  return isRecord(value) && "isSuccess" in value;
};

export const getNetworkErrorMessage = (errorCode?: string): string => {
  if (errorCode === "ECONNABORTED" || errorCode === "ETIMEDOUT") {
    return i18n.t("common.timeoutError");
  }
  return i18n.t("common.networkError");
};

export const getPayloadErrorMessage = (payload: unknown): string | null => {
  if (isSimpleResult(payload) && typeof payload.message === "string") {
    return payload.message;
  }

  if (!isRecord(payload)) return null;

  if (typeof payload.detail === "string" && payload.detail.length > 0) {
    return payload.detail;
  }

  if (typeof payload.title === "string" && payload.title.length > 0) {
    return payload.title;
  }

  return null;
};

export const toFailedSimpleResult = (
  payload: unknown,
  fallbackMessage: string,
): TSimpleResult => {
  if (isSimpleResult(payload) && !payload.isSuccess) {
    return payload;
  }

  return {
    isSuccess: false,
    message: getPayloadErrorMessage(payload) ?? fallbackMessage,
    errorCode: null,
  };
};
