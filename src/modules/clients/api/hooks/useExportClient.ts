import { useMutation } from "@tanstack/react-query";
import { clientService } from "../services/client.service";
import type { TClientExportRequest } from "../../utils/clientExportParams";
import type { TClientExportResult } from "../../types/client";

export const useExportClient = () =>
  useMutation<TClientExportResult, Error, TClientExportRequest>({
    mutationFn: clientService.export,
  });
