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

export const clientFilesQueryKey = (clientId: number) =>
  [...clientQueryRootKey, "files", clientId] as const;

export const removeClientDetailQuery = (clientId: number) => {
  queryClient.removeQueries({ queryKey: clientDetailQueryKey(clientId) });
};

export const removeClientFilesQuery = (clientId: number) => {
  queryClient.removeQueries({ queryKey: clientFilesQueryKey(clientId) });
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

export const invalidateClientFiles = async (clientId: number) => {
  await queryClient.invalidateQueries({
    queryKey: clientFilesQueryKey(clientId),
    refetchType: "all",
  });
};

export const invalidateAfterClientCreate = async () => {
  await queryClient.invalidateQueries({
    queryKey: clientQueryRootKey,
    refetchType: "all",
  });
};

export const invalidateAfterClientUpdate = async (clientId: number) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: clientsListQueryRootKey,
      refetchType: "none",
    }),
    queryClient.invalidateQueries({
      queryKey: [...clientQueryRootKey, "infinite"],
      refetchType: "none",
    }),
    queryClient.invalidateQueries({
      queryKey: clientDetailQueryKey(clientId),
      refetchType: "active",
    }),
  ]);
};

export const invalidateAfterClientDelete = async (clientId: number) => {
  removeClientDetailQuery(clientId);
  removeClientFilesQuery(clientId);
  await invalidateClientListQueries();
};
