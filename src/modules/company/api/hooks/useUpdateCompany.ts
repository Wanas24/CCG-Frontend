import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { companyService } from "../services/company.service";
import type { TUpdateCompanyRequest, TUpdateCompanyResponse } from "../../types";

type ApiError = { message: string };

export const useUpdateCompany = () => {
  return useMutation<
    TUpdateCompanyResponse,
    AxiosError<ApiError>,
    TUpdateCompanyRequest
  >({
    mutationFn: companyService.update,
  });
};
