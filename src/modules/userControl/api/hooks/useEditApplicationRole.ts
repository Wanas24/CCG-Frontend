import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { applicationRoleService } from "../services/applicationRole.service";
import type {
  TEditApplicationRoleRequest,
  TEditApplicationRoleResponse,
} from "../../types";

type ApiError = { message: string };

export const useEditApplicationRole = () => {
  return useMutation<
    TEditApplicationRoleResponse,
    AxiosError<ApiError>,
    TEditApplicationRoleRequest
  >({
    mutationFn: applicationRoleService.edit,
  });
};
