import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { clientService } from "../services/client.service";
import type {
  TUploadClientFilesRequest,
  TUploadClientFilesResponse,
} from "../../types/clientFile";

type ApiError = { message: string };

export const useUploadClientFiles = () =>
  useMutation<
    TUploadClientFilesResponse,
    AxiosError<ApiError>,
    TUploadClientFilesRequest
  >({
    mutationFn: clientService.uploadFiles,
  });
