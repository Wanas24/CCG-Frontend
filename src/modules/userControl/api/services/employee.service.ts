import { callEndpoint } from "@/lib/api/callEndpoint";
import { employeeEndpoints } from "../endPoints/employee.endpoints";
import { toPagedQueryParams } from "./toPagedQueryParams";
import type {
  TGetEmployeesParams,
  TGetEmployeesResponse,
  TRecruitEmployeeRequest,
  TRecruitEmployeeResponse,
} from "../../types";
import type {
  TActivateEmployeeResponse,
  TDeactivateEmployeeResponse,
  TFireEmployeeRequest,
  TFireEmployeeResponse,
  THireEmployeeRequest,
  THireEmployeeResponse,
  TSetEmployeeManagerRequest,
  TSetEmployeeManagerResponse,
} from "../../types/employeeLifecycle";
import type {
  TDeleteEmployeeFileResponse,
  TEmployeeFileDownloadResponse,
  TGetEmployeeFilesResponse,
  TUploadEmployeeFilesResponse,
} from "../../types/employeeFiles";

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

  hire: (body: THireEmployeeRequest) =>
    callEndpoint<THireEmployeeResponse, THireEmployeeRequest>(
      employeeEndpoints.hire,
      { body },
    ),

  fire: (body: TFireEmployeeRequest) =>
    callEndpoint<TFireEmployeeResponse, TFireEmployeeRequest>(
      employeeEndpoints.fire,
      { body },
    ),

  activate: (userId: string) =>
    callEndpoint<TActivateEmployeeResponse>(employeeEndpoints.activate, {
      pathParams: { userId },
    }),

  deactivate: (userId: string) =>
    callEndpoint<TDeactivateEmployeeResponse>(employeeEndpoints.deactivate, {
      pathParams: { userId },
    }),

  setManager: (body: TSetEmployeeManagerRequest) =>
    callEndpoint<TSetEmployeeManagerResponse, TSetEmployeeManagerRequest>(
      employeeEndpoints.setManager,
      { body },
    ),

  getFiles: (userId: string) =>
    callEndpoint<TGetEmployeeFilesResponse>(employeeEndpoints.files, {
      pathParams: { userId },
    }),

  uploadFile: (userId: string, file: File) => {
    const body = new FormData();
    body.append("Files", file);

    return callEndpoint<TUploadEmployeeFilesResponse, FormData>(
      employeeEndpoints.uploadFile,
      { queryParams: { userId }, body },
    );
  },

  downloadFile: (fileId: string) =>
    callEndpoint<TEmployeeFileDownloadResponse>(employeeEndpoints.downloadFile, {
      pathParams: { fileId },
    }),

  deleteFile: (fileId: string) =>
    callEndpoint<TDeleteEmployeeFileResponse>(employeeEndpoints.deleteFile, {
      pathParams: { fileId },
    }),
};
