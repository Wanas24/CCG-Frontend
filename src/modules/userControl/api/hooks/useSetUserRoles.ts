import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { applicationRoleService } from "../services/applicationRole.service";
import type { TSetUserRolesRequest, TSetUserRolesResponse } from "../../types";

type ApiError = { message: string };

export const useSetUserRoles = () => {
  return useMutation<
    TSetUserRolesResponse,
    AxiosError<ApiError>,
    TSetUserRolesRequest
  >({
    mutationFn: applicationRoleService.setUserRoles,
  });
};
