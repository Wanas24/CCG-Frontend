import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  applyApiFieldErrors,
  applyKnownApiFieldErrors,
  getAxiosErrorPayload,
  getSimpleResultFromAxiosError,
  getValidationProblemErrors,
} from "@/lib/api/applyApiFieldErrors";
import {
  getNetworkErrorMessage,
  getPayloadErrorMessage,
} from "@/lib/api/normalizeApiError";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useCreateClient } from "../api/hooks/useCreateClient";
import { invalidateAfterClientCreate } from "../api/queryKeys/clientQueryKeys";
import {
  CLIENT_FORM_FIELD_NAMES,
  clientFormSchema,
  type ClientFormValues,
} from "../schemas/clientFormSchema";
import {
  emptyClientFormValues,
  formValuesToCreateBody,
} from "../utils/clientFormValues";

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

  const notifyCreateFailure = (error: unknown) => {
    const payload = getAxiosErrorPayload(error);
    const validationErrors = getValidationProblemErrors(payload);

    if (validationErrors) {
      const { appliedCount, unmappedMessages } = applyKnownApiFieldErrors(
        form.setError,
        validationErrors,
        CLIENT_FORM_FIELD_NAMES,
      );

      if (unmappedMessages.length > 0) {
        toast.error(unmappedMessages.join(" "));
        return;
      }

      if (appliedCount === 0) {
        toast.error(
          getPayloadErrorMessage(payload) || t("clients.form.validationError"),
        );
      }
      return;
    }

    const result = getSimpleResultFromAxiosError(error);
    if (result) {
      applyApiFieldErrors(form.setError, result.data);
      if (result.message) {
        toast.error(result.message);
      }
      return;
    }

    if (axios.isAxiosError(error) && !error.response) {
      toast.error(getNetworkErrorMessage(error.code));
      return;
    }

    toast.error(
      getPayloadErrorMessage(payload) || t("common.unexpectedError"),
    );
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
      notifyCreateFailure(error);
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
