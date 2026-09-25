import { message } from "antd";
import type { TSimpleResult, TSimpleResultErrorCode } from "@/modules/authentication/types";

type ErrorHandler = () => void;

const registry = new Map<TSimpleResultErrorCode, ErrorHandler>();

export const registerErrorHandler = (
  code: TSimpleResultErrorCode,
  handler: ErrorHandler,
): void => {
  registry.set(code, handler);
};

type HandleApiResultOptions = {
  skipToast?: boolean;
};

export const handleApiResult = (
  result: TSimpleResult,
  options?: HandleApiResultOptions,
): void => {
  if (result.isSuccess) return;

  const code = result.errorCode ?? null;

  if (code !== null && registry.has(code)) {
    registry.get(code)!();
    return;
  }

  if (options?.skipToast) return;

  void message.error(result.message);
};
