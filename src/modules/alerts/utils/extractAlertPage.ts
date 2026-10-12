import type { TAlert, TGetMyAlertsResponse } from "../types";

type AlertPageExtraction = {
  rows: TAlert[];
  totalCount: number;
};

const asAlertArray = (value: unknown): TAlert[] =>
  Array.isArray(value) ? (value as TAlert[]) : [];

export const extractAlertPage = (
  response: TGetMyAlertsResponse | undefined,
): AlertPageExtraction => {
  if (!response?.isSuccess || response.data == null) {
    return { rows: [], totalCount: 0 };
  }

  const payload = response.data as unknown;

  if (Array.isArray(payload)) {
    return { rows: payload, totalCount: payload.length };
  }

  if (typeof payload !== "object") {
    return { rows: [], totalCount: 0 };
  }

  const record = payload as Record<string, unknown>;
  const rows = asAlertArray(
    record.data ?? record.Data ?? record.items ?? record.Items,
  );
  const totalCountRaw = record.totalCount ?? record.TotalCount ?? rows.length;
  const totalCount = Number(totalCountRaw);

  return {
    rows,
    totalCount: Number.isFinite(totalCount) ? totalCount : rows.length,
  };
};
