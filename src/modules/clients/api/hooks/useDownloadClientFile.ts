import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { clientService } from "../services/client.service";
import type { TDownloadClientFileResponse } from "../../types/clientFile";

type ApiError = { message: string };

export const useDownloadClientFile = () =>
  useMutation<TDownloadClientFileResponse, AxiosError<ApiError>, number>({
    mutationFn: clientService.downloadFile,
  });
