import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { companyService } from "../services/company.service";

type ApiError = { message: string };

export const useGetCompanies = () => {
  return useMutation<unknown, AxiosError<ApiError>, void>({
    mutationFn: companyService.getCompanies,
  });
};
