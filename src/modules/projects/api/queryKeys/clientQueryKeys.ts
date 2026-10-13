import { CLIENT_LOOKUP_PAGE_SIZE } from "../../constants/projectList";
import type { TGetClientsParams } from "../../types";

export const clientQueryRootKey = ["client"] as const;

export const clientsListQueryKey = (params: TGetClientsParams) =>
  [...clientQueryRootKey, "list", params] as const;

export const clientsInfiniteQueryKey = (search: string) =>
  [
    ...clientQueryRootKey,
    "infinite",
    { search, pageSize: CLIENT_LOOKUP_PAGE_SIZE },
  ] as const;
