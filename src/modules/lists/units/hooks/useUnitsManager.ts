import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useCreateMeasurement } from "../api/hooks/useCreateMeasurement";
import { useDeleteMeasurement } from "../api/hooks/useDeleteMeasurement";
import { useUpdateMeasurement } from "../api/hooks/useUpdateMeasurement";
import { invalidateMeasurementQueries } from "../api/queryKeys/measurementQueryKeys";
import {
  measurementFormSchema,
  type MeasurementFormValues,
} from "../schemas/measurementFormSchema";
import type { TMeasurement } from "../types/measurement";

const emptyValues: MeasurementFormValues = {
  unit: "",
  details: "",
};

export const useUnitsManager = () => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PermissionsList.Measurement.Create);
  const canEdit = hasPermission(PermissionsList.Measurement.Edit);
  const canDelete = hasPermission(PermissionsList.Measurement.Delete);

  const createMutation = useCreateMeasurement();
  const updateMutation = useUpdateMeasurement();
  const deleteMutation = useDeleteMeasurement();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<TMeasurement | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<TMeasurement | null>(null);

  const form = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementFormSchema),
    defaultValues: emptyValues,
  });

  const openCreate = () => {
    if (!canCreate) return;
    setEditingUnit(null);
    form.reset(emptyValues);
    setDrawerOpen(true);
  };

  const openEdit = (unit: TMeasurement) => {
    if (!canEdit) return;
    setEditingUnit(unit);
    form.reset({
      unit: unit.unit,
      details: unit.details ?? "",
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingUnit(null);
    form.reset(emptyValues);
  };

  const openDelete = (unit: TMeasurement) => {
    if (!canDelete) return;
    setDeletingUnit(unit);
  };

  const closeDelete = () => {
    setDeletingUnit(null);
  };

  const submitUnit = form.handleSubmit(async (values) => {
    const payload = {
      unit: values.unit.trim(),
      details: values.details.trim() || null,
    };

    if (editingUnit) {
      if (!canEdit) return;
      const response = await updateMutation.mutateAsync({
        id: editingUnit.id,
        ...payload,
      });
      if (!response.isSuccess) return;
      toast.success(response.message || t("lists.units.save"));
    } else {
      if (!canCreate) return;
      const response = await createMutation.mutateAsync(payload);
      if (!response.isSuccess) return;
      toast.success(response.message || t("lists.units.add"));
    }

    closeDrawer();
    await invalidateMeasurementQueries();
  });

  const confirmDelete = async () => {
    if (!canDelete || !deletingUnit) return;
    const response = await deleteMutation.mutateAsync(deletingUnit.id);
    if (!response.isSuccess) return;
    toast.success(response.message || t("lists.units.delete"));
    closeDelete();
    await invalidateMeasurementQueries();
  };

  return {
    canCreate,
    canEdit,
    canDelete,
    form,
    drawerOpen,
    editingUnit,
    deletingUnit,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    openCreate,
    openEdit,
    closeDrawer,
    submitUnit,
    openDelete,
    closeDelete,
    confirmDelete,
  };
};
