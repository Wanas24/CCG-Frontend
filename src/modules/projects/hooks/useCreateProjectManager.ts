import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useCreateProject } from "../api/hooks/useCreateProject";
import { invalidateAfterProjectCreate } from "../api/queryKeys/projectQueryKeys";
import { PROJECT_WORKSPACE_DEFAULT_SECTION } from "../constants/workspaceSections";
import { projectWorkspacePath } from "../routes/paths";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "../schemas/projectFormSchema";
import {
  emptyProjectFormValues,
  formValuesToCreateBody,
} from "../utils/projectFormValues";

export const useCreateProjectManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PermissionsList.Project.Create);
  const createMutation = useCreateProject();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [clientLabel, setClientLabel] = useState<string | undefined>();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: emptyProjectFormValues(),
  });

  const openCreate = () => {
    if (!canCreate) return;
    form.reset(emptyProjectFormValues());
    setClientLabel(undefined);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (createMutation.isPending) return;
    setDrawerOpen(false);
    setClientLabel(undefined);
    form.reset(emptyProjectFormValues());
  };

  const submitCreate = form.handleSubmit(async (values) => {
    if (!canCreate || createMutation.isPending) return;

    try {
      const response = await createMutation.mutateAsync(
        formValuesToCreateBody(values),
      );

      if (!response.isSuccess) {
        applyApiFieldErrors(form.setError, response.data);
        return;
      }

      const createdId =
        typeof response.data === "number"
          ? response.data
          : Number(response.data);

      toast.success(response.message || t("projects.form.createSuccess"));
      setDrawerOpen(false);
      form.reset(emptyProjectFormValues());
      setClientLabel(undefined);
      await invalidateAfterProjectCreate();

      if (Number.isFinite(createdId) && createdId > 0) {
        navigate(
          projectWorkspacePath(createdId, PROJECT_WORKSPACE_DEFAULT_SECTION),
        );
      }
    } catch (error) {
      const result = getSimpleResultFromAxiosError(error);
      applyApiFieldErrors(form.setError, result?.data);
    }
  });

  return {
    canCreate,
    form,
    drawerOpen,
    clientLabel,
    setClientLabel,
    isSaving: createMutation.isPending,
    openCreate,
    closeDrawer,
    submitCreate,
  };
};
