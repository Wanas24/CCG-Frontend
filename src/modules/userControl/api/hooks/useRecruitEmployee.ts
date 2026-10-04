import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { employeeService } from "../services/employee.service";
import type {
  TRecruitEmployeeRequest,
  TRecruitEmployeeResponse,
} from "../../types";

type ApiError = { message: string };

export const useRecruitEmployee = () => {
  return useMutation<
    TRecruitEmployeeResponse,
    AxiosError<ApiError>,
    TRecruitEmployeeRequest
  >({
    mutationFn: employeeService.recruit,
  });
};
