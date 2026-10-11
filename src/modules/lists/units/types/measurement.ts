import type { TSimpleResult } from "@/modules/authentication/types";
import type {
  TApiPagedResult,
  TPagedQueryParams,
} from "@/modules/userControl/types";

export type TMeasurement = {
  id: number;
  unit: string;
  details?: string | null;
};

export type TMeasurementCreateRequest = {
  unit: string;
  details?: string | null;
};

export type TMeasurementUpdateRequest = {
  id: number;
  unit: string;
  details?: string | null;
};

export type TGetMeasurementsParams = TPagedQueryParams;

export type TGetMeasurementsResponse = TSimpleResult<
  TApiPagedResult<TMeasurement>
>;

export type TCreateMeasurementResponse = TSimpleResult<number>;

export type TUpdateMeasurementResponse = TSimpleResult<unknown>;

export type TDeleteMeasurementResponse = TSimpleResult<unknown>;
