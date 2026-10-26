import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { applyApiFieldErrors } from "@/lib/api/applyApiFieldErrors";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useCreateClient } from "../api/hooks/useCreateClient";
import { invalidateAfterClientCreate } from "../api/queryKeys/clientQueryKeys";
import {
  clientFormSchema,
  type ClientFormValues,
} from "../schemas/clientFormSchema";
import {
  emptyClientFormValues,
  formValuesToCreateBody,
} from "../utils/clientFormValues";
import { notifyClientFormApiError } from "../utils/notifyClientFormApiError";

export const useCreateClientManager = () => {
  const { t } = useTranslation();
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const canCreate =
    !permissionsLoading && hasPermission(PermissionsList.Client.Create);
  const createMutation = useCreateClient();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: emptyClientFormValues(),
  });

  const openCreate = () => {
    if (!canCreate) return;
    form.reset(emptyClientFormValues());
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (createMutation.isPending) return;
    setDrawerOpen(false);
    form.reset(emptyClientFormValues());
  };

  const submitCreate = form.handleSubmit(async (values) => {
    if (!canCreate || createMutation.isPending) return;

    try {
      const response = await createMutation.mutateAsync(
        formValuesToCreateBody(values),
      );

      if (!response.isSuccess) {
        applyApiFieldErrors(form.setError, response.data);
        if (response.message) {
          toast.error(response.message);
        }
        return;
      }

      toast.success(response.message || t("clients.form.createSuccess"));
      setDrawerOpen(false);
      form.reset(emptyClientFormValues());
      await invalidateAfterClientCreate();
    } catch (error) {
      notifyClientFormApiError(error, form.setError, t);
    }
  });

  return {
    canCreate,
    form,
    drawerOpen,
    isSaving: createMutation.isPending,
    openCreate,
    closeDrawer,
    submitCreate,
  };
};
