import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useUpdateProject } from "../api/hooks/useUpdateProject";
import { invalidateAfterProjectUpdate } from "../api/queryKeys/projectQueryKeys";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "../schemas/projectFormSchema";
import type { TProject } from "../types/project";
import {
  formValuesToUpdateBody,
  projectToFormValues,
} from "../utils/projectFormValues";

export const useProjectOverviewManager = (project: TProject) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission(PermissionsList.Project.Edit);
  const updateMutation = useUpdateProject();

  const [editing, setEditing] = useState(false);
  const editingRef = useRef(editing);

  const [clientLabel, setClientLabel] = useState<string | undefined>(
    project.clientName ?? undefined,
  );

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: projectToFormValues(project),
  });

  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);

  useEffect(() => {
    if (editingRef.current) return;
    form.reset(projectToFormValues(project));
    setClientLabel(project.clientName ?? undefined);
  }, [form, project]);

  const startEdit = () => {
    if (!canEdit) return;
    form.reset(projectToFormValues(project));
    setClientLabel(project.clientName ?? undefined);
    setEditing(true);
  };

  const cancelEdit = () => {
    if (updateMutation.isPending) return;
    form.reset(projectToFormValues(project));
    setClientLabel(project.clientName ?? undefined);
    setEditing(false);
  };

  const submitUpdate = form.handleSubmit(async (values) => {
    if (!canEdit || updateMutation.isPending) return;

    try {
      const response = await updateMutation.mutateAsync(
        formValuesToUpdateBody(values, project.id),
      );

      if (!response.isSuccess) {
        applyApiFieldErrors(form.setError, response.data);
        return;
      }

      toast.success(response.message || t("projects.form.updateSuccess"));
      form.reset(values);
      setEditing(false);
      await invalidateAfterProjectUpdate(project.id);
    } catch (error) {
      const result = getSimpleResultFromAxiosError(error);
      applyApiFieldErrors(form.setError, result?.data);
    }
  });

  return {
    canEdit,
    form,
    editing,
    clientLabel,
    setClientLabel,
    isSaving: updateMutation.isPending,
    startEdit,
    cancelEdit,
    submitUpdate,
  };
};
