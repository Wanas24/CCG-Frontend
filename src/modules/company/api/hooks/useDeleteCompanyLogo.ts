import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { companyService } from "../services/company.service";
import type { TDeleteCompanyLogoResponse } from "../../types";

type ApiError = { message: string };

export const useDeleteCompanyLogo = () => {
  return useMutation<TDeleteCompanyLogoResponse, AxiosError<ApiError>, void>({
    mutationFn: companyService.deleteLogo,
  });
};
