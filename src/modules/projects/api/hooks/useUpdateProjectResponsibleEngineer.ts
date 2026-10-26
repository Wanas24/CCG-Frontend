import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectResponsibleEngineerService } from "../services/projectResponsibleEngineer.service";
import type {
  TUpdateProjectResponsibleEngineerRequest,
  TUpdateProjectResponsibleEngineerResponse,
} from "../../types/projectResponsibleEngineer";

type ApiError = { message: string };

export const useUpdateProjectResponsibleEngineer = () =>
  useMutation<
    TUpdateProjectResponsibleEngineerResponse,
    AxiosError<ApiError>,
    TUpdateProjectResponsibleEngineerRequest
  >({
    mutationFn: projectResponsibleEngineerService.update,
  });
