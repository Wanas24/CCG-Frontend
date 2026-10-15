import { queryClient } from "@/lib/queryClient";
import { CLIENTS_PAGE_SIZE } from "../../constants/clientList";
import type { TGetClientsParams } from "../../types";

export const clientQueryRootKey = ["client"] as const;

export const clientsListQueryRootKey = [...clientQueryRootKey, "list"] as const;

export const clientsListQueryKey = (params: TGetClientsParams) =>
  [...clientsListQueryRootKey, params] as const;

export const clientsInfiniteQueryKey = (search: string) =>
  [
    ...clientQueryRootKey,
    "infinite",
    { search, pageSize: CLIENTS_PAGE_SIZE },
  ] as const;

export const clientDetailQueryKey = (id: number) =>
  [...clientQueryRootKey, "detail", id] as const;

export const removeClientDetailQuery = (clientId: number) => {
  queryClient.removeQueries({ queryKey: clientDetailQueryKey(clientId) });
};

export const invalidateClientListQueries = async () => {
  await queryClient.invalidateQueries({
    queryKey: clientsListQueryRootKey,
    refetchType: "all",
  });
  await queryClient.invalidateQueries({
    queryKey: [...clientQueryRootKey, "infinite"],
    refetchType: "all",
  });
};

export const invalidateAfterClientCreate = async () => {
  await queryClient.invalidateQueries({
    queryKey: clientQueryRootKey,
    refetchType: "all",
  });
};

export const invalidateAfterClientUpdate = async () => {
  await queryClient.invalidateQueries({
    queryKey: clientQueryRootKey,
    refetchType: "all",
  });
};

export const invalidateAfterClientDelete = async (clientId: number) => {
  removeClientDetailQuery(clientId);
  await invalidateClientListQueries();
};
