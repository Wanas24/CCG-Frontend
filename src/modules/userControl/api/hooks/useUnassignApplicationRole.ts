import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { applicationRoleService } from "../services/applicationRole.service";
import type { TUnassignApplicationRoleResponse } from "../../types";

type ApiError = { message: string };

type Variables = {
  userId: string;
  roleId: string;
};

export const useUnassignApplicationRole = () => {
  return useMutation<
    TUnassignApplicationRoleResponse,
    AxiosError<ApiError>,
    Variables
  >({
    mutationFn: ({ userId, roleId }) =>
      applicationRoleService.unassign(userId, roleId),
  });
};
