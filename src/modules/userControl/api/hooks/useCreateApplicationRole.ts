import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { applicationRoleService } from "../services/applicationRole.service";
import type {
  TCreateApplicationRoleRequest,
  TCreateApplicationRoleResponse,
} from "../../types";

type ApiError = { message: string };

export const useCreateApplicationRole = () => {
  return useMutation<
    TCreateApplicationRoleResponse,
    AxiosError<ApiError>,
    TCreateApplicationRoleRequest
  >({
    mutationFn: applicationRoleService.create,
  });
};
