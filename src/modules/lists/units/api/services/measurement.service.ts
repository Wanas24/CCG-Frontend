import { callEndpoint } from "@/lib/api/callEndpoint";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";
import { toPagedQueryParams } from "@/modules/userControl/api/services/toPagedQueryParams";
import { measurementEndpoints } from "../endPoints/measurement.endpoints";
import type {
  TCreateMeasurementResponse,
  TDeleteMeasurementResponse,
  TGetMeasurementsParams,
  TGetMeasurementsResponse,
  TMeasurementCreateRequest,
  TMeasurementUpdateRequest,
  TUpdateMeasurementResponse,
} from "../../types/measurement";

const MAX_PAGE_SIZE = 100;

const toQueryParams = (params: TGetMeasurementsParams = {}) => {
  const page = params.page ?? 1;
  const pageSize = Math.min(params.pageSize ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  return toPagedQueryParams({
    page,
    pageSize,
    search: params.search,
  });
};

export const measurementService = {
  list: (params?: TGetMeasurementsParams) =>
    callEndpoint<TGetMeasurementsResponse>(measurementEndpoints.list, {
      queryParams: toQueryParams(params),
    }),

  create: (body: TMeasurementCreateRequest) =>
    callEndpoint<TCreateMeasurementResponse, TMeasurementCreateRequest>(
      measurementEndpoints.create,
      { body },
    ),

  update: (body: TMeasurementUpdateRequest) =>
    callEndpoint<TUpdateMeasurementResponse, TMeasurementUpdateRequest>(
      measurementEndpoints.update,
      { body },
    ),

  delete: (id: number) =>
    callEndpoint<TDeleteMeasurementResponse>(measurementEndpoints.delete, {
      pathParams: { id },
    }),
};
