import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { TSimpleResult } from "@/modules/authentication/types";

export type TApiFieldErrorMap = Record<string, string[]>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

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

const uniqueMessages = (messages: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const message of messages) {
    if (!message || seen.has(message)) continue;
    seen.add(message);
    result.push(message);
  }
  return result;
};

export const applyApiFieldErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  data: unknown,
): void => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return;

  for (const [field, value] of Object.entries(data)) {
    const messages = toErrorMessages(value);
    if (!messages) continue;
    const unique = uniqueMessages(messages);
    if (unique.length === 0) continue;
    setError(toCamelCaseField(field) as Path<T>, {
      type: "server",
      message: unique[0],
    });
  }
};

export const getValidationProblemErrors = (
  payload: unknown,
): TApiFieldErrorMap | null => {
  if (!isRecord(payload)) return null;
  if (!isRecord(payload.errors)) return null;

  const map: TApiFieldErrorMap = {};
  let hasAny = false;

  for (const [key, value] of Object.entries(payload.errors)) {
    const messages = toErrorMessages(value);
    if (!messages) continue;
    const unique = uniqueMessages(messages);
    if (unique.length === 0) continue;
    map[key] = unique;
    hasAny = true;
  }

  return hasAny ? map : null;
};

export type ApplyKnownApiFieldErrorsResult = {
  appliedCount: number;
  unmappedMessages: string[];
};

export const applyKnownApiFieldErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  errorMap: TApiFieldErrorMap,
  knownFields: readonly string[],
): ApplyKnownApiFieldErrorsResult => {
  const knownByLower = new Map(
    knownFields.map((field) => [field.toLowerCase(), field] as const),
  );

  let appliedCount = 0;
  const unmappedMessages: string[] = [];
  const seenUnmapped = new Set<string>();

  for (const [key, messages] of Object.entries(errorMap)) {
    const unique = uniqueMessages(messages);
    if (unique.length === 0) continue;

    const knownField = knownByLower.get(key.toLowerCase());
    if (knownField) {
      setError(knownField as Path<T>, {
        type: "server",
        message: unique.join(" "),
      });
      appliedCount += 1;
      continue;
    }

    for (const message of unique) {
      if (seenUnmapped.has(message)) continue;
      seenUnmapped.add(message);
      unmappedMessages.push(message);
    }
  }

  return { appliedCount, unmappedMessages };
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

export const getAxiosErrorPayload = (error: unknown): unknown => {
  if (!axios.isAxiosError(error)) return undefined;
  return error.response?.data;
};
