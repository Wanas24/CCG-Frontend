import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { applicationRoleService } from "../services/applicationRole.service";
import type { TSetApplicationRolePermissionsResponse } from "../../types";

type ApiError = { message: string };

type Variables = {
  roleId: string;
  permissionIds: number[];
};

export const useSetApplicationRolePermissions = () => {
  return useMutation<
    TSetApplicationRolePermissionsResponse,
    AxiosError<ApiError>,
    Variables
  >({
    mutationFn: ({ roleId, permissionIds }) =>
      applicationRoleService.setPermissions(roleId, permissionIds),
  });
};
