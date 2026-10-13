import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectResponsibleEngineerService } from "../services/projectResponsibleEngineer.service";
import type {
  TCreateProjectResponsibleEngineerRequest,
  TCreateProjectResponsibleEngineerResponse,
} from "../../types/projectResponsibleEngineer";

type ApiError = { message: string };

export const useCreateProjectResponsibleEngineer = () =>
  useMutation<
    TCreateProjectResponsibleEngineerResponse,
    AxiosError<ApiError>,
    TCreateProjectResponsibleEngineerRequest
  >({
    mutationFn: projectResponsibleEngineerService.create,
  });
