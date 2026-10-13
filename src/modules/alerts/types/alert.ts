import type { TSimpleResult } from "@/modules/authentication/types";
import type {
  TApiPagedResult,
  TPagedQueryParams,
} from "@/modules/userControl/types";

export type TAlertUiStatus = "live" | "scheduled" | "done" | "canceled";

export type TAlertAudienceMode = "managers" | "everyone" | "people";

export type TAlertReceiver = {
  userId: string;
  fullName?: string;
  email?: string;
};

export type TAlert = {
  id: number;
  message: string;
  triggerAt: string;
  isDone: boolean;
  isCanceled: boolean;
  assignToAllEmployees: boolean;
  createdById?: string;
  createdAt?: string | null;
  receivers: TAlertReceiver[];
  projectId?: number | null;
  projectName?: string;
  entityId?: number | null;
  entityType?: number | string | null;
  entityTypeName?: string;
};

export type TAlertEmployee = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isManager?: boolean;
};

export const AlertEntityType = {
  Project: 1,
} as const;

export type TAlertEntityType =
  (typeof AlertEntityType)[keyof typeof AlertEntityType];

export type TAlertEntityContext = {
  entityType?: TAlertEntityType | string | number;
  entityId?: number;
  projectId?: number;
};

export type TCreateGeneralAlertRequest = {
  message: string;
  triggerAt: string;
  assignToAllEmployees: boolean;
  assignToManagers: boolean;
  receiverUserIds: string[];
};

export type TCreateAlertRequest = TCreateGeneralAlertRequest & {
  projectId?: number;
  entityId?: number;
  entityType?: string | number;
};

export type TGetMyAlertsParams = TPagedQueryParams & {
  liveOnly?: boolean;
  isDone?: boolean;
  isCanceled?: boolean;
};

export type TGetAlertEmployeesParams = TPagedQueryParams & {
  isManager?: boolean;
  isFired?: boolean;
  isActive?: boolean;
};

export type TGetMyAlertsResponse = TSimpleResult<TApiPagedResult<TAlert>>;

export type TGetAlertEmployeesResponse = TSimpleResult<
  TApiPagedResult<TAlertEmployee>
>;

export type TCreateAlertResponse = TSimpleResult<number>;

export type TAlertActionResponse = TSimpleResult<unknown>;
