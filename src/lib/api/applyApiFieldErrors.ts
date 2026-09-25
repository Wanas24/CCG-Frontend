import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { TSimpleResult } from "@/modules/authentication/types";

export type TApiFieldErrorMap = Record<string, string[]>;

const toCamelCaseField = (key: string): string => {
  if (!key) return key;
  return key.charAt(0).toLowerCase() + key.slice(1);
};

const toErrorMessages = (value: unknown): string[] | null => {
  if (typeof value === "string" && value.length > 0) return [value];
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string")
  ) {
    return value;
  }
  return null;
};

export const applyApiFieldErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  data: unknown,
): void => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return;

  for (const [field, value] of Object.entries(data)) {
    const messages = toErrorMessages(value);
    if (!messages) continue;
    setError(toCamelCaseField(field) as Path<T>, {
      type: "server",
      message: messages[0],
    });
  }
};

export const getSimpleResultFromAxiosError = (
  error: unknown,
): TSimpleResult | null => {
  if (!axios.isAxiosError(error)) return null;

  const payload = error.response?.data;
  if (!payload || typeof payload !== "object" || !("isSuccess" in payload)) {
    return null;
  }

  return payload as TSimpleResult;
};
