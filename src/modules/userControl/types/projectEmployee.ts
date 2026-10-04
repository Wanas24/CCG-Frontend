import type { TSimpleResult } from "@/modules/authentication/types";
import type { TApiPagedResult, TPagedQueryParams } from "./paged";

export type TProjectUser = {
  id: string;
  firstName: string;
  lastName: string;
};

export type TProjectWithUsers = {
  id: number;
  name: string;
  number: string;
  users: TProjectUser[];
};

export type TGetActiveProjectsParams = TPagedQueryParams;

export type TGetActiveProjectsResponse = TSimpleResult<
  TApiPagedResult<TProjectWithUsers>
>;

export type TSetUserProjectsRequest = {
  userId: string;
  projectIds: number[];
};

export type TSetUserProjectsResponse = TSimpleResult<string>;
