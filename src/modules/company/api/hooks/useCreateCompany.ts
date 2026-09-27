import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { companyService } from "../services/company.service";
import type { TCreateCompanyRequest, TCreateCompanyResponse } from "../../types";

type ApiError = { message: string };

export const useCreateCompany = () => {
  return useMutation<
    TCreateCompanyResponse,
    AxiosError<ApiError>,
    TCreateCompanyRequest
  >({
    mutationFn: companyService.create,
  });
};
