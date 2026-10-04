import axios from "axios";
import { getSimpleResultFromAxiosError } from "@/lib/api/applyApiFieldErrors";

export const isForbiddenError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 403;

export const readApiMessage = (error: unknown, fallback: string) => {
  const result = getSimpleResultFromAxiosError(error);
  if (result?.message) return result.message;

  if (axios.isAxiosError(error)) {
    const message = error.response?.data;
    if (
      message &&
      typeof message === "object" &&
      "message" in message &&
      typeof message.message === "string" &&
      message.message.length > 0
    ) {
      return message.message;
    }
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};
