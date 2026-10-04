import type { TSimpleResult } from "@/modules/authentication/types";
import type { TApiPagedResult, TPagedQueryParams } from "./paged";

export type TEmployee = {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationalId: string;
  isActive: boolean;
  isFired: boolean;
  isManager: boolean;
  isDefaultManager: boolean;
  isAccountActive: boolean;
  rolesCount: number;
  permissionsCount: number;
};

export type TGetEmployeesParams = TPagedQueryParams & {
  isManager?: boolean;
  isFired?: boolean;
  isActive?: boolean;
};

export type TGetEmployeesResponse = TSimpleResult<TApiPagedResult<TEmployee>>;

export type TRecruitEmployeeRequest = {
  employeeEmail: string;
};

export type TRecruitEmployeeResponse = TSimpleResult<string>;
