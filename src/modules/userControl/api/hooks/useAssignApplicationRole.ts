import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { applicationRoleService } from "../services/applicationRole.service";
import type {
  TAssignApplicationRoleRequest,
  TAssignApplicationRoleResponse,
} from "../../types";

type ApiError = { message: string };

export const useAssignApplicationRole = () => {
  return useMutation<
    TAssignApplicationRoleResponse,
    AxiosError<ApiError>,
    TAssignApplicationRoleRequest
  >({
    mutationFn: applicationRoleService.assign,
  });
};
