import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useGetEmployees } from "@/modules/userControl/api/hooks/useGetEmployees";
import type { TEmployee } from "@/modules/userControl/types";
import { useCreateProjectResponsibleEngineer } from "../api/hooks/useCreateProjectResponsibleEngineer";
import { useDecideProjectResponsibleEngineer } from "../api/hooks/useDecideProjectResponsibleEngineer";
import { useDeleteProjectResponsibleEngineer } from "../api/hooks/useDeleteProjectResponsibleEngineer";
import { useGetProjectResponsibleEngineers } from "../api/hooks/useGetProjectResponsibleEngineers";
import { useUpdateProjectResponsibleEngineer } from "../api/hooks/useUpdateProjectResponsibleEngineer";
import { invalidateProjectResponsibleEngineers } from "../api/queryKeys/projectTeamQueryKeys";
import {
  EngineerApprovalDecision,
  EngineerPosition,
  type TEngineerApprovalDecision,
} from "../constants/engineerPositions";
import type { TProject } from "../types/project";
import type { TProjectResponsibleEngineer } from "../types/projectResponsibleEngineer";

const EMPLOYEE_PAGE_SIZE = 10;

export type EngineerFormState = {
  employeeId: string;
  employeeName: string;
  position: number;
};

const emptyEngineerForm = (): EngineerFormState => ({
  employeeId: "",
  employeeName: "",
  position: EngineerPosition.ProjectManager,
});

export const useProjectResponsibleEngineersManager = (project: TProject) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const canGetEngineers = hasPermission(
    PermissionsList.ProjectResponsibleEngineer.GetByProject,
  );
  const canCreate = hasPermission(
    PermissionsList.ProjectResponsibleEngineer.Create,
  );
  const canEdit = hasPermission(PermissionsList.ProjectResponsibleEngineer.Edit);
  const canDelete = hasPermission(
    PermissionsList.ProjectResponsibleEngineer.Delete,
  );
  const canExport = hasPermission(
    PermissionsList.ProjectResponsibleEngineer.Export,
  );
  const canGetEmployees = hasPermission(PermissionsList.Employee.Get);
  const canManageForm = canCreate || canEdit;

  const engineersQuery = useGetProjectResponsibleEngineers(
    project.id,
    canGetEngineers,
  );
  const createMutation = useCreateProjectResponsibleEngineer();
  const updateMutation = useUpdateProjectResponsibleEngineer();
  const deleteMutation = useDeleteProjectResponsibleEngineer();
  const decideMutation = useDecideProjectResponsibleEngineer();

  const [engineerForm, setEngineerForm] = useState<EngineerFormState>(
    emptyEngineerForm,
  );
  const [editingEngineer, setEditingEngineer] =
    useState<TProjectResponsibleEngineer | null>(null);
  const [deletingEngineer, setDeletingEngineer] =
    useState<TProjectResponsibleEngineer | null>(null);
  const [decidingId, setDecidingId] = useState<number | null>(null);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [debouncedEmployeeSearch] = useDebounce(employeeSearch.trim(), 300);
  const employeesQuery = useGetEmployees(
    {
      pageSize: EMPLOYEE_PAGE_SIZE,
      search: debouncedEmployeeSearch || undefined,
      isFired: false,
    },
    canGetEmployees && canManageForm && canGetEngineers,
  );

  const engineers = useMemo(() => {
    if (!canGetEngineers) return [];
    const data = engineersQuery.data?.isSuccess
      ? engineersQuery.data.data
      : undefined;
    return Array.isArray(data) ? data : [];
  }, [canGetEngineers, engineersQuery.data]);

  const employees = useMemo(() => {
    const pages = employeesQuery.data?.pages ?? [];
    return pages.flatMap((page) =>
      page.isSuccess ? (page.data?.data ?? []) : [],
    );
  }, [employeesQuery.data?.pages]);

  const personName = (person: Pick<TEmployee, "firstName" | "lastName">) =>
    [person.firstName, person.lastName].filter(Boolean).join(" ").trim();

  const resetEngineerForm = () => {
    setEditingEngineer(null);
    setEngineerForm(emptyEngineerForm());
  };

  const startEditEngineer = (engineer: TProjectResponsibleEngineer) => {
    if (!canEdit) return;
    setEditingEngineer(engineer);
    setEngineerForm({
      employeeId: engineer.employeeId ?? "",
      employeeName: engineer.employeeName ?? "",
      position: Number(engineer.position) || EngineerPosition.ProjectManager,
    });
  };

  const selectEmployeeForEngineer = (employeeId: string) => {
    if (!canManageForm) return;
    const person = employees.find((item) => item.id === employeeId);
    setEngineerForm((current) => ({
      ...current,
      employeeId,
      employeeName: person ? personName(person) : current.employeeName,
    }));
  };

  const submitEngineer = async () => {
    if (createMutation.isPending || updateMutation.isPending) return;

    if (editingEngineer) {
      if (!canEdit) return;
    } else if (!canCreate) {
      return;
    }

    if (!engineerForm.employeeName.trim()) {
      toast.error(t("projects.team.engineerNameRequired"));
      return;
    }

    const body = {
      projectId: project.id,
      employeeId: engineerForm.employeeId || null,
      employeeName: engineerForm.employeeName.trim(),
      position: engineerForm.position,
    };

    try {
      if (editingEngineer) {
        const response = await updateMutation.mutateAsync({
          ...body,
          id: editingEngineer.id,
        });
        if (!response.isSuccess) {
          toast.error(response.message || t("projects.team.engineerSaveFailed"));
          return;
        }
        toast.success(response.message || t("projects.team.engineerUpdated"));
      } else {
        const response = await createMutation.mutateAsync(body);
        if (!response.isSuccess) {
          toast.error(response.message || t("projects.team.engineerSaveFailed"));
          return;
        }
        toast.success(response.message || t("projects.team.engineerCreated"));
      }
      resetEngineerForm();
      await invalidateProjectResponsibleEngineers(project.id);
    } catch {
      toast.error(t("projects.team.engineerSaveFailed"));
    }
  };

  const openDeleteEngineer = (engineer: TProjectResponsibleEngineer) => {
    if (!canDelete) return;
    setDeletingEngineer(engineer);
  };

  const closeDeleteEngineer = () => {
    if (deleteMutation.isPending) return;
    setDeletingEngineer(null);
  };

  const confirmDeleteEngineer = async () => {
    if (!canDelete || !deletingEngineer || deleteMutation.isPending) return;
    try {
      const response = await deleteMutation.mutateAsync(deletingEngineer.id);
      if (!response.isSuccess) {
        toast.error(response.message || t("projects.team.engineerDeleteFailed"));
        return;
      }
      toast.success(response.message || t("projects.team.engineerDeleted"));
      if (editingEngineer?.id === deletingEngineer.id) {
        resetEngineerForm();
      }
      setDeletingEngineer(null);
      await invalidateProjectResponsibleEngineers(project.id);
    } catch {
      toast.error(t("projects.team.engineerDeleteFailed"));
    }
  };

  const decideEngineer = async (
    engineer: TProjectResponsibleEngineer,
    decision: TEngineerApprovalDecision,
  ) => {
    if (!canGetEngineers || !engineer.canApprove || decideMutation.isPending) {
      return;
    }
    setDecidingId(engineer.id);
    try {
      const response = await decideMutation.mutateAsync({
        id: engineer.id,
        decision,
      });
      if (!response.isSuccess) {
        toast.error(response.message || t("projects.team.decisionFailed"));
        return;
      }
      toast.success(
        response.message ||
          (decision === EngineerApprovalDecision.Approve
            ? t("projects.team.decisionApproved")
            : t("projects.team.decisionDeclined")),
      );
      await invalidateProjectResponsibleEngineers(project.id);
    } catch {
      toast.error(t("projects.team.decisionFailed"));
    } finally {
      setDecidingId(null);
    }
  };

  const showCreateForm = canCreate && !editingEngineer;
  const showEditForm = canEdit && Boolean(editingEngineer);
  const showForm = showCreateForm || showEditForm;

  return {
    canGetEngineers,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canGetEmployees,
    canManageForm,
    showForm,
    engineers,
    engineersQuery,
    employees,
    employeesQuery,
    employeeSearch,
    setEmployeeSearch,
    engineerForm,
    setEngineerForm,
    editingEngineer,
    deletingEngineer,
    decidingId,
    isSavingEngineer: createMutation.isPending || updateMutation.isPending,
    isDeletingEngineer: deleteMutation.isPending,
    isDeciding: decideMutation.isPending,
    personName,
    selectEmployeeForEngineer,
    startEditEngineer,
    resetEngineerForm,
    submitEngineer,
    openDeleteEngineer,
    closeDeleteEngineer,
    confirmDeleteEngineer,
    decideEngineer,
  };
};
