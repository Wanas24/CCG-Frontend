import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { companyService } from "../services/company.service";
import type { TDeleteCompanyResponse } from "../../types";

type ApiError = { message: string };

export const useDeleteCompany = () => {
  return useMutation<TDeleteCompanyResponse, AxiosError<ApiError>, void>({
    mutationFn: companyService.delete,
  });
};
