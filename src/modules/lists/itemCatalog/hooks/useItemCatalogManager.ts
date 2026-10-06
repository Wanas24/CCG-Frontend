import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useCreateItemCategory } from "../api/hooks/useCreateItemCategory";
import { useDeleteItemCategory } from "../api/hooks/useDeleteItemCategory";
import { useDeleteItemCategoryFile } from "../api/hooks/useDeleteItemCategoryFile";
import { useGetItemCategoryFileUrl } from "../api/hooks/useGetItemCategoryFileUrl";
import { useUpdateItemCategory } from "../api/hooks/useUpdateItemCategory";
import { useUploadItemCategoryFiles } from "../api/hooks/useUploadItemCategoryFiles";
import {
  invalidateItemCategoryFiles,
  invalidateItemCategoryQueries,
} from "../api/queryKeys/itemCategoryQueryKeys";
import {
  itemCategoryFormSchema,
  type ItemCategoryFormValues,
} from "../schemas/itemCategoryFormSchema";
import type { TItemCategory, TItemCategoryFile } from "../types/itemCategory";

const emptyValues: ItemCategoryFormValues = {
  name: "",
  type: 0,
  unitId: 0,
  description: "",
  notes: "",
};

export const useItemCatalogManager = () => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const canGet = hasPermission(PermissionsList.ItemCategory.Get);
  const canCreate = hasPermission(PermissionsList.ItemCategory.Create);
  const canEdit = hasPermission(PermissionsList.ItemCategory.Edit);
  const canDelete = hasPermission(PermissionsList.ItemCategory.Delete);
  const canGetFiles = hasPermission(PermissionsList.ItemCategory.GetFiles);
  const canUpload = hasPermission(PermissionsList.ItemCategory.Upload);
  const canDownload = hasPermission(PermissionsList.ItemCategory.Download);
  const canDeleteFile = hasPermission(PermissionsList.ItemCategory.DeleteFile);

  const createMutation = useCreateItemCategory();
  const updateMutation = useUpdateItemCategory();
  const deleteMutation = useDeleteItemCategory();
  const uploadMutation = useUploadItemCategoryFiles();
  const deleteFileMutation = useDeleteItemCategoryFile();
  const fileUrlMutation = useGetItemCategoryFileUrl();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TItemCategory | null>(null);
  const [createdItemId, setCreatedItemId] = useState<number | null>(null);
  const [deletingItem, setDeletingItem] = useState<TItemCategory | null>(null);
  const [deletingFile, setDeletingFile] = useState<TItemCategoryFile | null>(
    null,
  );

  const form = useForm<ItemCategoryFormValues>({
    resolver: zodResolver(itemCategoryFormSchema),
    defaultValues: emptyValues,
  });

  const activeItemId = editingItem?.id ?? createdItemId;

  const openCreate = (prefillType?: number) => {
    if (!canCreate) return;
    setEditingItem(null);
    setCreatedItemId(null);
    form.reset({
      ...emptyValues,
      ...(prefillType !== undefined && prefillType > 0
        ? { type: prefillType }
        : {}),
    });
    setDrawerOpen(true);
  };

  const openEdit = (item: TItemCategory) => {
    setEditingItem(item);
    setCreatedItemId(null);
    form.reset({
      name: item.name,
      type: item.type,
      unitId: item.unitId,
      description: item.description ?? "",
      notes: item.notes ?? "",
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingItem(null);
    setCreatedItemId(null);
    form.reset(emptyValues);
  };

  const submitItem = form.handleSubmit(async (values) => {
    const body = {
      name: values.name.trim(),
      type: values.type,
      unitId: values.unitId,
      description: values.description.trim() || null,
      notes: values.notes.trim() || null,
    };

    if (editingItem || createdItemId) {
      if (!canEdit) return;
      const id = editingItem?.id ?? createdItemId!;
      const response = await updateMutation.mutateAsync({ ...body, id });
      if (!response.isSuccess) return;
      toast.success(response.message || t("lists.itemCatalog.save"));
      await invalidateItemCategoryQueries();
      return;
    }

    if (!canCreate) return;
    const response = await createMutation.mutateAsync(body);
    if (!response.isSuccess) return;
    toast.success(response.message || t("lists.itemCatalog.create"));
    const newId =
      typeof response.data === "number" ? response.data : Number(response.data);
    if (Number.isFinite(newId) && newId > 0) {
      setCreatedItemId(newId);
    }
    await invalidateItemCategoryQueries();
  });

  const openDelete = (item: TItemCategory) => {
    if (!canDelete) return;
    setDeletingItem(item);
  };

  const closeDelete = () => setDeletingItem(null);

  const confirmDelete = async () => {
    if (!canDelete || !deletingItem) return;
    const response = await deleteMutation.mutateAsync(deletingItem.id);
    if (!response.isSuccess) return;
    toast.success(response.message || t("lists.itemCatalog.delete"));
    closeDelete();
    if (activeItemId === deletingItem.id) {
      closeDrawer();
    }
    await invalidateItemCategoryQueries();
  };

  const uploadFiles = async (files: File[]) => {
    if (!canUpload || !activeItemId || files.length === 0) return;
    const response = await uploadMutation.mutateAsync({
      id: activeItemId,
      files,
    });
    if (!response.isSuccess) return;
    toast.success(response.message || t("lists.itemCatalog.upload"));
    await invalidateItemCategoryFiles(activeItemId);
  };

  const openDeleteFile = (file: TItemCategoryFile) => {
    if (!canDeleteFile) return;
    setDeletingFile(file);
  };

  const closeDeleteFile = () => setDeletingFile(null);

  const confirmDeleteFile = async () => {
    if (!canDeleteFile || !deletingFile || !activeItemId) return;
    const response = await deleteFileMutation.mutateAsync(deletingFile.fileId);
    if (!response.isSuccess) return;
    toast.success(response.message || t("lists.itemCatalog.deleteFile"));
    closeDeleteFile();
    await invalidateItemCategoryFiles(activeItemId);
  };

  const downloadFile = async (file: TItemCategoryFile) => {
    if (!canDownload) return;
    const response = await fileUrlMutation.mutateAsync(file.fileId);
    if (!response.isSuccess || !response.data?.url) return;
    window.open(response.data.url, "_blank", "noopener,noreferrer");
  };

  return {
    canGet,
    canCreate,
    canEdit,
    canDelete,
    canGetFiles,
    canUpload,
    canDownload,
    canDeleteFile,
    form,
    drawerOpen,
    editingItem,
    createdItemId,
    activeItemId,
    deletingItem,
    deletingFile,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploading: uploadMutation.isPending,
    isDeletingFile: deleteFileMutation.isPending,
    isDownloading: fileUrlMutation.isPending,
    openCreate,
    openEdit,
    closeDrawer,
    submitItem,
    openDelete,
    closeDelete,
    confirmDelete,
    uploadFiles,
    openDeleteFile,
    closeDeleteFile,
    confirmDeleteFile,
    downloadFile,
  };
};
