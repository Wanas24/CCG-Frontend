import type { TSimpleResult } from "@/modules/authentication/types";

export type THireEmployeeRequest = {
  userId: string;
};

export type TFireEmployeeRequest = {
  employeeId: string;
};

export type TSetEmployeeManagerRequest = {
  userId: string;
  isManager: boolean;
};

export type THireEmployeeResponse = TSimpleResult;

export type TFireEmployeeResponse = TSimpleResult;

export type TActivateEmployeeResponse = TSimpleResult;

export type TDeactivateEmployeeResponse = TSimpleResult;

export type TSetEmployeeManagerResponse = TSimpleResult;
