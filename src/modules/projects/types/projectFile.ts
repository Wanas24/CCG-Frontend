import type { TSimpleResult } from "@/modules/authentication/types";

export type TProjectFile = {
  fileId: number;
  fileName: string;
  fileSize?: number | null;
  description?: string | null;
  uploadedAt?: string | null;
  fileType?: string | null;
  url?: string | null;
};

export type TProjectFileDownload = {
  url: string;
  fileName?: string | null;
};

export type TGetProjectFilesResponse = TSimpleResult<TProjectFile[]>;

export type TUploadProjectFilesResponse = TSimpleResult;

export type TDeleteProjectFileResponse = TSimpleResult;

export type TDownloadProjectFileResponse = TSimpleResult<TProjectFileDownload>;

export type TUploadProjectFilesRequest = {
  projectId: number;
  files: File[];
  names: string[];
  descriptions: string[];
};
