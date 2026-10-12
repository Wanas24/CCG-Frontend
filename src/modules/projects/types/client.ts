import type { TSimpleResult } from "@/modules/authentication/types";
import type { TApiPagedResult } from "@/modules/userControl/types";

export type TClient = {
  id: number;
  name: string;
};

export type TGetClientsParams = {
  page?: number;
  pageSize?: number;
};

export type TGetClientsResponse = TSimpleResult<TApiPagedResult<TClient>>;
