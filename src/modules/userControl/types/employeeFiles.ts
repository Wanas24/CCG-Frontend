import type { TSimpleResult } from "@/modules/authentication/types";

export type TEmployeeFile = {
  fileId: string;
  fileName: string;
  description?: string | null;
};

export type TEmployeeFileDownload = {
  url: string;
};

export type TGetEmployeeFilesResponse = TSimpleResult<TEmployeeFile[]>;

export type TEmployeeFileDownloadResponse = TSimpleResult<TEmployeeFileDownload>;

export type TUploadEmployeeFilesResponse = TSimpleResult;

export type TDeleteEmployeeFileResponse = TSimpleResult;
