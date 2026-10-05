import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCreateApplicationRole } from "../api/hooks/useCreateApplicationRole";
import { useEditApplicationRole } from "../api/hooks/useEditApplicationRole";
import { roleFormSchema, type RoleFormValues } from "../schemas";
import type { TApplicationRole } from "../types";

type Params = {
  roleCatalog: Map<string, TApplicationRole>;
  canCreateRole: boolean;
  canEditRole: boolean;
  reload: () => Promise<void>;
  onCreated: (roleId: string) => void;
};

export const useUserControlRoleForm = ({
  roleCatalog,
  canCreateRole,
  canEditRole,
  reload,
  onCreated,
}: Params) => {
  const { t } = useTranslation();
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const createRoleMutation = useCreateApplicationRole();
  const editRoleMutation = useEditApplicationRole();

  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: { name: "", description: "" },
  });

  const openCreateRole = () => {
    if (!canCreateRole) return;
    setEditingRoleId(null);
    roleForm.reset({ name: "", description: "" });
    setRoleModalOpen(true);
  };

  const openEditRole = (roleId: string) => {
    const role = roleCatalog.get(roleId);
    if (!role || role.isShared || !canEditRole) return;
    setEditingRoleId(roleId);
    roleForm.reset({ name: role.name, description: role.description ?? "" });
    setRoleModalOpen(true);
  };

  const submitRole = roleForm.handleSubmit(async (values) => {
    const name = values.name.trim();
    const description = values.description.trim();

    if (editingRoleId) {
      const response = await editRoleMutation.mutateAsync({
        id: editingRoleId,
        name,
        description,
      });
      if (!response.isSuccess) return;
      toast.success(response.message || t("userControl.toast.roleUpdated"));
      setRoleModalOpen(false);
      await reload();
      return;
    }

    const response = await createRoleMutation.mutateAsync({ name, description });
    if (!response.isSuccess) return;
    toast.success(response.message || t("userControl.toast.roleCreated", { name }));
    setRoleModalOpen(false);
    await reload();
    if (typeof response.data === "string" && response.data) {
      onCreated(response.data);
    }
  });

  return {
    roleForm,
    roleModalOpen,
    editingRole: editingRoleId ? (roleCatalog.get(editingRoleId) ?? null) : null,
    openCreateRole,
    openEditRole,
    closeRoleModal: () => setRoleModalOpen(false),
    submitRole,
    roleSaving: createRoleMutation.isPending || editRoleMutation.isPending,
  };
};
