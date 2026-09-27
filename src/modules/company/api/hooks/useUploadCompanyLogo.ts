import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { companyService } from "../services/company.service";
import type { TCompanyLogoResponse } from "../../types";

type ApiError = { message: string };

export const useUploadCompanyLogo = () => {
  return useMutation<TCompanyLogoResponse, AxiosError<ApiError>, File>({
    mutationFn: companyService.uploadLogo,
  });
};
