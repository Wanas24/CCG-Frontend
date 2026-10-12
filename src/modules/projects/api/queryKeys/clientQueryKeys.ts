import type { TGetClientsParams } from "../../types";

export const clientQueryRootKey = ["client"] as const;

export const clientsListQueryKey = (params: TGetClientsParams) =>
  [...clientQueryRootKey, "list", params] as const;
