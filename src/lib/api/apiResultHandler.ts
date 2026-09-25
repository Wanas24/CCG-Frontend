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

export const handleApiResult = (result: TSimpleResult): void => {
  if (result.isSuccess) return;

  const code = result.errorCode ?? null;

  if (code !== null && registry.has(code)) {
    registry.get(code)!();
    return;
  }

  void message.error(result.message);
};
