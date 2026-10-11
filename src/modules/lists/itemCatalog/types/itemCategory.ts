import type { TSimpleResult } from "@/modules/authentication/types";
import type {
  TApiPagedResult,
  TPagedQueryParams,
} from "@/modules/userControl/types";

export type TItemCategoryType = {
  value: number;
  name: string;
};

export type TItemCategoryFile = {
  fileId: number;
  fileName: string;
  fileSize: number;
  fileType?: string | null;
  description?: string | null;
  uploadedAt?: string | null;
  numberOfReads?: number;
  url?: string | null;
  isPrivate?: boolean;
};

export type TItemCategory = {
  id: number;
  name: string;
  description?: string | null;
  notes?: string | null;
  unitId: number;
  unit?: string | null;
  type: number;
  typeName?: string | null;
  addedBy?: string | null;
  addedAt?: string | null;
  updatedBy?: string | null;
  updatedAt?: string | null;
  files?: TItemCategoryFile[];
};

export type TItemCategoryWriteRequest = {
  name: string;
  type: number;
  unitId: number;
  description?: string | null;
  notes?: string | null;
};

export type TItemCategoryUpdateRequest = TItemCategoryWriteRequest & {
  id: number;
};

export type TGetItemCategoriesParams = TPagedQueryParams & {
  unitId?: number;
  type?: number;
};

export type TItemCategoryFileUrl = {
  url: string;
  fileName?: string;
  isPrivate?: boolean;
};

export type TGetItemCategoriesResponse = TSimpleResult<
  TApiPagedResult<TItemCategory>
>;

export type TGetItemCategoryTypesResponse = TSimpleResult<TItemCategoryType[]>;

export type TCreateItemCategoryResponse = TSimpleResult<number>;

export type TUpdateItemCategoryResponse = TSimpleResult<unknown>;

export type TDeleteItemCategoryResponse = TSimpleResult<unknown>;

export type TGetItemCategoryFilesResponse = TSimpleResult<TItemCategoryFile[]>;

export type TUploadItemCategoryFilesResponse = TSimpleResult<unknown>;

export type TDeleteItemCategoryFileResponse = TSimpleResult<unknown>;

export type TGetItemCategoryFileUrlResponse = TSimpleResult<TItemCategoryFileUrl>;
