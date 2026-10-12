import type { TGetClientsParams } from "../../types";

export const clientQueryRootKey = ["client"] as const;

export const clientsListQueryKey = (params: TGetClientsParams) =>
  [...clientQueryRootKey, "list", params] as const;

export const clientsInfiniteQueryKey = (search: string) =>
  [...clientQueryRootKey, "infinite", { search, pageSize: 10 }] as const;
