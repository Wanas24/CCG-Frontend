import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { applyApiFieldErrors } from "@/lib/api/applyApiFieldErrors";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useUpdateClient } from "../api/hooks/useUpdateClient";
import { invalidateAfterClientUpdate } from "../api/queryKeys/clientQueryKeys";
import {
  clientFormSchema,
  type ClientFormValues,
} from "../schemas/clientFormSchema";
import type { TClient } from "../types/client";
import {
  clientToFormValues,
  formValuesToEditBody,
} from "../utils/clientFormValues";
import { notifyClientFormApiError } from "../utils/notifyClientFormApiError";

export const useClientOverviewManager = (client: TClient) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PermissionsList.Client.Edit);
  const updateMutation = useUpdateClient();

  const [editing, setEditing] = useState(false);
  const editingRef = useRef(editing);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: clientToFormValues(client),
  });

  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);

  useEffect(() => {
    if (editingRef.current) return;
    form.reset(clientToFormValues(client));
  }, [client, form]);

  const startEdit = () => {
    if (!canEdit) return;
    form.reset(clientToFormValues(client));
    setEditing(true);
  };

  const cancelEdit = () => {
    if (updateMutation.isPending) return;
    form.reset(clientToFormValues(client));
    setEditing(false);
  };

  const submitUpdate = form.handleSubmit(async (values) => {
    if (!canEdit || updateMutation.isPending) return;

    try {
      const response = await updateMutation.mutateAsync(
        formValuesToEditBody(values, client.id),
      );

      if (!response.isSuccess) {
        applyApiFieldErrors(form.setError, response.data);
        if (response.message) {
          toast.error(response.message);
        }
        return;
      }

      toast.success(response.message || t("clients.form.editSuccess"));
      form.reset(values);
      setEditing(false);
      await invalidateAfterClientUpdate();
    } catch (error) {
      notifyClientFormApiError(error, form.setError, t);
    }
  });

  return {
    canEdit,
    form,
    editing,
    isSaving: updateMutation.isPending,
    startEdit,
    cancelEdit,
    submitUpdate,
  };
};
