import { callEndpoint } from "@/lib/api/callEndpoint";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";
import { toPagedQueryParams } from "@/modules/userControl/api/services/toPagedQueryParams";
import { itemCategoryEndpoints } from "../endPoints/itemCategory.endpoints";
import type {
  TCreateItemCategoryResponse,
  TDeleteItemCategoryFileResponse,
  TDeleteItemCategoryResponse,
  TGetItemCategoriesParams,
  TGetItemCategoriesResponse,
  TGetItemCategoryFilesResponse,
  TGetItemCategoryFileUrlResponse,
  TGetItemCategoryTypesResponse,
  TItemCategoryUpdateRequest,
  TItemCategoryWriteRequest,
  TUpdateItemCategoryResponse,
  TUploadItemCategoryFilesResponse,
} from "../../types/itemCategory";

const MAX_PAGE_SIZE = 100;

const toQueryParams = (params: TGetItemCategoriesParams = {}) => {
  const page = params.page ?? 1;
  const pageSize = Math.min(params.pageSize ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  return {
    ...toPagedQueryParams({
      page,
      pageSize,
      search: params.search,
    }),
    ...(params.unitId !== undefined ? { unitId: params.unitId } : {}),
    ...(params.type !== undefined ? { type: params.type } : {}),
  };
};

export const itemCategoryService = {
  list: (params?: TGetItemCategoriesParams) =>
    callEndpoint<TGetItemCategoriesResponse>(itemCategoryEndpoints.list, {
      queryParams: toQueryParams(params),
    }),

  types: () =>
    callEndpoint<TGetItemCategoryTypesResponse>(itemCategoryEndpoints.types),

  create: (body: TItemCategoryWriteRequest) =>
    callEndpoint<TCreateItemCategoryResponse, TItemCategoryWriteRequest>(
      itemCategoryEndpoints.create,
      { body },
    ),

  update: (body: TItemCategoryUpdateRequest) =>
    callEndpoint<TUpdateItemCategoryResponse, TItemCategoryUpdateRequest>(
      itemCategoryEndpoints.update,
      { body },
    ),

  delete: (id: number) =>
    callEndpoint<TDeleteItemCategoryResponse>(itemCategoryEndpoints.delete, {
      pathParams: { id },
    }),

  files: (id: number) =>
    callEndpoint<TGetItemCategoryFilesResponse>(itemCategoryEndpoints.files, {
      pathParams: { id },
    }),

  uploadFiles: (id: number, files: File[]) => {
    const body = new FormData();
    for (const file of files) {
      body.append("Files", file);
    }

    return callEndpoint<TUploadItemCategoryFilesResponse, FormData>(
      itemCategoryEndpoints.uploadFiles,
      { pathParams: { id }, body },
    );
  },

  deleteFile: (fileId: number) =>
    callEndpoint<TDeleteItemCategoryFileResponse>(
      itemCategoryEndpoints.deleteFile,
      { pathParams: { fileId } },
    ),

  fileUrl: (fileId: number) =>
    callEndpoint<TGetItemCategoryFileUrlResponse>(
      itemCategoryEndpoints.fileUrl,
      { pathParams: { fileId } },
    ),
};
