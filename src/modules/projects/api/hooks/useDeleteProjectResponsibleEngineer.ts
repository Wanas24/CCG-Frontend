import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectResponsibleEngineerService } from "../services/projectResponsibleEngineer.service";
import type { TDeleteProjectResponsibleEngineerResponse } from "../../types/projectResponsibleEngineer";

type ApiError = { message: string };

export const useDeleteProjectResponsibleEngineer = () =>
  useMutation<
    TDeleteProjectResponsibleEngineerResponse,
    AxiosError<ApiError>,
    number
  >({
    mutationFn: projectResponsibleEngineerService.delete,
  });
