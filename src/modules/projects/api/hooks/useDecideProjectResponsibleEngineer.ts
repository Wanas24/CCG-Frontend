import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectResponsibleEngineerService } from "../services/projectResponsibleEngineer.service";
import type {
  TDecideProjectResponsibleEngineerRequest,
  TDecideProjectResponsibleEngineerResponse,
} from "../../types/projectResponsibleEngineer";

type ApiError = { message: string };

export const useDecideProjectResponsibleEngineer = () =>
  useMutation<
    TDecideProjectResponsibleEngineerResponse,
    AxiosError<ApiError>,
    TDecideProjectResponsibleEngineerRequest
  >({
    mutationFn: projectResponsibleEngineerService.decide,
  });
