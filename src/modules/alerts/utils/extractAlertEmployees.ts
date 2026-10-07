import type {
  TAlertEmployee,
  TGetAlertEmployeesResponse,
} from "../types";

const asEmployeeArray = (value: unknown): TAlertEmployee[] =>
  Array.isArray(value) ? (value as TAlertEmployee[]) : [];

export const extractAlertEmployees = (
  response: TGetAlertEmployeesResponse | undefined,
): TAlertEmployee[] => {
  if (!response?.isSuccess || response.data == null) {
    return [];
  }

  const payload = response.data as unknown;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  return asEmployeeArray(
    record.data ?? record.Data ?? record.items ?? record.Items,
  );
};
