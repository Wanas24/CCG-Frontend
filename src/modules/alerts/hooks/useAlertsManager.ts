import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCancelAlert } from "../api/hooks/useCancelAlert";
import { useCreateAlert } from "../api/hooks/useCreateAlert";
import { useDeleteAlert } from "../api/hooks/useDeleteAlert";
import { useMarkAlertDone } from "../api/hooks/useMarkAlertDone";
import { invalidateAlertQueries } from "../api/queryKeys/alertQueryKeys";
import type { AlertConfirmKind } from "../components/AlertConfirmDialogs";
import {
  alertFormSchema,
  type AlertFormValues,
} from "../schemas/alertFormSchema";
import type { TAlert, TAlertEntityContext } from "../types";
import { buildCreateAlertRequest } from "../utils/buildCreateAlertRequest";
import { getDefaultAlertTriggerAt } from "../utils/formatAlertDateTime";

const createEmptyValues = (): AlertFormValues => ({
  message: "",
  triggerAt: getDefaultAlertTriggerAt(),
  audience: "managers",
  receiverUserIds: [],
});

export const useAlertsManager = () => {
  const { t } = useTranslation();
  const createMutation = useCreateAlert();
  const doneMutation = useMarkAlertDone();
  const cancelMutation = useCancelAlert();
  const deleteMutation = useDeleteAlert();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmKind, setConfirmKind] = useState<AlertConfirmKind | null>(
    null,
  );
  const [actingAlert, setActingAlert] = useState<TAlert | null>(null);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: createEmptyValues(),
  });

  const openCreate = () => {
    form.reset(createEmptyValues());
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    form.reset(createEmptyValues());
  };

  const openConfirm = (kind: AlertConfirmKind, alert: TAlert) => {
    setConfirmKind(kind);
    setActingAlert(alert);
  };

  const closeConfirm = () => {
    setConfirmKind(null);
    setActingAlert(null);
  };

  const submitAlert = (entityContext?: TAlertEntityContext) =>
    form.handleSubmit(async (values) => {
      const payload = buildCreateAlertRequest({
        message: values.message,
        triggerAt: values.triggerAt,
        audience: values.audience,
        receiverUserIds: values.receiverUserIds,
        entityContext,
      });

      const response = await createMutation.mutateAsync(payload);
      if (!response.isSuccess) return;

      toast.success(response.message || t("alerts.toasts.created"));
      closeDrawer();
      await invalidateAlertQueries();
    });

  const confirmAction = async () => {
    if (!confirmKind || !actingAlert) return;

    const response =
      confirmKind === "done"
        ? await doneMutation.mutateAsync(actingAlert.id)
        : confirmKind === "cancel"
          ? await cancelMutation.mutateAsync(actingAlert.id)
          : await deleteMutation.mutateAsync(actingAlert.id);

    if (!response.isSuccess) return;

    const successKey =
      confirmKind === "done"
        ? "alerts.toasts.markedDone"
        : confirmKind === "cancel"
          ? "alerts.toasts.canceled"
          : "alerts.toasts.deleted";

    toast.success(response.message || t(successKey));
    closeConfirm();
    await invalidateAlertQueries();
  };

  return {
    form,
    drawerOpen,
    confirmKind,
    actingAlert,
    isSaving: createMutation.isPending,
    isActing:
      doneMutation.isPending ||
      cancelMutation.isPending ||
      deleteMutation.isPending,
    openCreate,
    closeDrawer,
    submitAlert,
    openDone: (alert: TAlert) => openConfirm("done", alert),
    openCancel: (alert: TAlert) => openConfirm("cancel", alert),
    openDelete: (alert: TAlert) => openConfirm("delete", alert),
    closeConfirm,
    confirmAction,
  };
};
