import axios from "axios";
import { callBlobEndpoint, callEndpoint } from "@/lib/api/callEndpoint";
import { getSimpleResultFromAxiosError } from "@/lib/api/applyApiFieldErrors";
import type { TSimpleResult } from "@/modules/authentication/types";
import type {
  TLastUsedResult,
  TLayout,
  TLayoutInput,
  TPreviewInput,
  TPreviewResult,
  TReportLayoutSummary,
} from "../../types";
import { reportLayoutEndpoints } from "../endPoints/reportLayout.endpoints";

export type TReportLayoutResponse = TSimpleResult<TLayout>;
export type TReportLayoutListResponse = TSimpleResult<TLayout[]>;
export type TReportLayoutSummaryResponse = TSimpleResult<TReportLayoutSummary>;
export type TReportLayoutMutationResponse = TSimpleResult<TLayout | null>;

const isCanceled = (error: unknown) =>
  axios.isCancel(error) ||
  (axios.isAxiosError(error) &&
    (error.code === "ERR_CANCELED" || error.name === "CanceledError"));

const readBlobMessage = async (data: unknown) => {
  if (!(data instanceof Blob)) return "";
  try {
    const text = await data.text();
    const parsed: unknown = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      "message" in parsed &&
      typeof parsed.message === "string"
    ) {
      return parsed.message;
    }
  } catch {
    return "";
  }
  return "";
};

export const reportLayoutService = {
  list: (includeInactive: boolean) =>
    callEndpoint<TReportLayoutListResponse>(reportLayoutEndpoints.list, {
      queryParams: { includeInactive },
    }),

  getSummary: (includeInactive: boolean) =>
    callEndpoint<TReportLayoutSummaryResponse>(reportLayoutEndpoints.summary, {
      queryParams: { includeInactive },
    }),

  getById: (layoutId: string) =>
    callEndpoint<TReportLayoutResponse>(reportLayoutEndpoints.getById, {
      pathParams: { layoutId },
    }),

  create: (body: TLayoutInput) =>
    callEndpoint<TReportLayoutResponse, TLayoutInput>(
      reportLayoutEndpoints.create,
      { body },
    ),

  update: (layoutId: string, body: TLayoutInput) =>
    callEndpoint<TReportLayoutResponse, TLayoutInput>(
      reportLayoutEndpoints.update,
      { pathParams: { layoutId }, body },
    ),

  deactivate: (layoutId: string) =>
    callEndpoint<TSimpleResult>(reportLayoutEndpoints.deactivate, {
      pathParams: { layoutId },
    }),

  lastUsed: async (reportType: string): Promise<TLastUsedResult> => {
    try {
      const result = await callEndpoint<TReportLayoutResponse>(
        reportLayoutEndpoints.lastUsed,
        { pathParams: { reportType } },
      );
      if (!result.isSuccess || !result.data) return { status: "empty" };
      return { status: "found", layout: result.data };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return { status: "empty" };
      }
      return {
        status: "error",
        message: getSimpleResultFromAxiosError(error)?.message ?? "",
      };
    }
  },

  previewSample: async (
    body: TPreviewInput,
    signal?: AbortSignal,
  ): Promise<TPreviewResult> => {
    try {
      const response = await callBlobEndpoint<TPreviewInput>(
        reportLayoutEndpoints.preview,
        { body, signal },
      );
      if (!response.contentType.toLowerCase().includes("pdf")) {
        return { ok: false, message: await readBlobMessage(response.data) };
      }
      return { ok: true, blob: response.data };
    } catch (error) {
      if (isCanceled(error)) throw error;
      if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        return { ok: false, message: await readBlobMessage(error.response.data) };
      }
      return {
        ok: false,
        message: getSimpleResultFromAxiosError(error)?.message ?? "",
      };
    }
  },
};
