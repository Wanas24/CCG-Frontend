import type { TSimpleResult } from "@/modules/authentication/types";

export type TReportLayoutImage = {
  fileId: number;
  fileName: string;
  url: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
};

export type TReportLayoutImagesResponse = TSimpleResult<TReportLayoutImage[]>;

export type TUploadReportLayoutImageResponse = TSimpleResult<TReportLayoutImage>;

export type TDeleteReportLayoutImageResponse = TSimpleResult;
