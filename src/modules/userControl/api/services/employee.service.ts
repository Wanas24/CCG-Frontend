import { callEndpoint } from "@/lib/api/callEndpoint";
import { employeeEndpoints } from "../endPoints/employee.endpoints";
import { toPagedQueryParams } from "./toPagedQueryParams";
import type {
  TGetEmployeesParams,
  TGetEmployeesResponse,
  TRecruitEmployeeRequest,
  TRecruitEmployeeResponse,
} from "../../types";

export const employeeService = {
  list: (params?: TGetEmployeesParams) =>
    callEndpoint<TGetEmployeesResponse>(employeeEndpoints.list, {
      queryParams: {
        ...toPagedQueryParams(params),
        ...(params?.isManager !== undefined
          ? { isManager: params.isManager }
          : {}),
        ...(params?.isFired !== undefined ? { isFired: params.isFired } : {}),
        ...(params?.isActive !== undefined
          ? { isActive: params.isActive }
          : {}),
      },
    }),

  recruit: (body: TRecruitEmployeeRequest) =>
    callEndpoint<TRecruitEmployeeResponse, TRecruitEmployeeRequest>(
      employeeEndpoints.recruit,
      { body },
    ),
};
