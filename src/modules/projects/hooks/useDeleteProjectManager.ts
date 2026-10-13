import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useDeleteProject } from "../api/hooks/useDeleteProject";
import { invalidateAfterProjectDelete } from "../api/queryKeys/projectQueryKeys";
import { PROJECTS_ROUTES } from "../routes/paths";
import type { TProject } from "../types/project";

export const useDeleteProjectManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canDelete = hasPermission(PermissionsList.Project.Delete);
  const deleteMutation = useDeleteProject();
  const [deletingProject, setDeletingProject] = useState<TProject | null>(null);

  const openDelete = (project: TProject) => {
    if (!canDelete) return;
    setDeletingProject(project);
  };

  const closeDelete = () => {
    if (deleteMutation.isPending) return;
    setDeletingProject(null);
  };

  const confirmDelete = async () => {
    if (!canDelete || !deletingProject || deleteMutation.isPending) return;

    const projectId = deletingProject.id;

    try {
      const response = await deleteMutation.mutateAsync(projectId);
      if (!response.isSuccess) return;

      toast.success(response.message || t("projects.form.deleteSuccess"));
      setDeletingProject(null);
      await invalidateAfterProjectDelete(projectId);
      navigate(PROJECTS_ROUTES.root);
    } catch {
      return;
    }
  };

  return {
    canDelete,
    deletingProject,
    isDeleting: deleteMutation.isPending,
    openDelete,
    closeDelete,
    confirmDelete,
  };
};
