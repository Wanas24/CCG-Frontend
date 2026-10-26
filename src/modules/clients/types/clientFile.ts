import type { TSimpleResult } from "@/modules/authentication/types";

export type TClientFile = {
  fileId: number;
  fileName: string;
  fileSize?: number | null;
  description?: string | null;
  uploadedAt?: string | null;
  fileType?: string | null;
  url?: string | null;
};

export type TClientFileDownload = {
  url: string;
  fileName?: string | null;
};

export type TGetClientFilesResponse = TSimpleResult<TClientFile[]>;

export type TUploadClientFilesResponse = TSimpleResult;

export type TDeleteClientFileResponse = TSimpleResult;

export type TDownloadClientFileResponse = TSimpleResult<TClientFileDownload>;

export type TUploadClientFilesRequest = {
  clientId: number;
  files: File[];
  names: string[];
  descriptions: string[];
};
