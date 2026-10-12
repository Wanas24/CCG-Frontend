import { useCallback } from "react";
import type { TPreviewInput } from "../../types";
import { reportLayoutService } from "../services/reportLayout.service";

export const usePreviewReportLayout = () => {
  const preview = useCallback(
    (body: TPreviewInput, signal?: AbortSignal) =>
      reportLayoutService.previewSample(body, signal),
    [],
  );

  return { preview };
};

export const useCheckLastUsedLayout = () => {
  const check = useCallback(
    (reportType: string) => reportLayoutService.lastUsed(reportType),
    [],
  );

  return { check };
};
