import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useDeleteClient } from "../api/hooks/useDeleteClient";
import { invalidateAfterClientDelete } from "../api/queryKeys/clientQueryKeys";
import { CLIENTS_ROUTES } from "../routes/paths";
import type { TClient } from "../types/client";

export const useDeleteClientManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canDelete = hasPermission(PermissionsList.Client.Delete);
  const deleteMutation = useDeleteClient();
  const [deletingClient, setDeletingClient] = useState<TClient | null>(null);
  const [cleanupClientId, setCleanupClientId] = useState<number | null>(null);

  const openDelete = (client: TClient) => {
    if (!canDelete) return;
    setDeletingClient(client);
  };

  const closeDelete = () => {
    if (deleteMutation.isPending || cleanupClientId != null) return;
    setDeletingClient(null);
  };

  const confirmDelete = async () => {
    if (
      !canDelete ||
      !deletingClient ||
      deleteMutation.isPending ||
      cleanupClientId != null
    ) {
      return;
    }

    const clientId = deletingClient.id;

    try {
      const response = await deleteMutation.mutateAsync(clientId);
      if (!response.isSuccess) return;

      toast.success(response.message || t("clients.form.deleteSuccess"));
      setDeletingClient(null);
      setCleanupClientId(clientId);
    } catch {
      return;
    }
  };

  useEffect(() => {
    if (cleanupClientId == null) return;

    let cancelled = false;

    void (async () => {
      navigate(CLIENTS_ROUTES.root);
      await invalidateAfterClientDelete(cleanupClientId);
      if (!cancelled) setCleanupClientId(null);
    })();

    return () => {
      cancelled = true;
    };
  }, [cleanupClientId, navigate]);

  return {
    canDelete,
    deletingClient,
    cleanupClientId,
    isDeleting: deleteMutation.isPending || cleanupClientId != null,
    openDelete,
    closeDelete,
    confirmDelete,
  };
};
