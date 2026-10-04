import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { applicationRoleService } from "../services/applicationRole.service";
import type { TDeleteApplicationRoleResponse } from "../../types";

type ApiError = { message: string };

export const useDeleteApplicationRole = () => {
  return useMutation<
    TDeleteApplicationRoleResponse,
    AxiosError<ApiError>,
    string
  >({
    mutationFn: applicationRoleService.delete,
  });
};
