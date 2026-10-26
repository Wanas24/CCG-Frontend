import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useDeleteClientFile } from "../api/hooks/useDeleteClientFile";
import { useDownloadClientFile } from "../api/hooks/useDownloadClientFile";
import { useGetClientFiles } from "../api/hooks/useGetClientFiles";
import { useUploadClientFiles } from "../api/hooks/useUploadClientFiles";
import { invalidateClientFiles } from "../api/queryKeys/clientQueryKeys";
import type { TClientFile } from "../types/clientFile";
import { downloadClientFileFromUrl } from "../utils/clientFileDownload";

export type ClientFileAction = {
  fileId: number;
  kind: "view" | "download";
};

export type TPendingClientUpload = {
  key: string;
  file: File;
  name: string;
  description: string;
};

let pendingUploadKey = 0;

const nextPendingKey = () => {
  pendingUploadKey += 1;
  return `pending-upload-${pendingUploadKey}`;
};

export const useClientFilesManager = (clientId: number) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const canGetFiles = hasPermission(PermissionsList.Client.GetFiles);
  const canUpload = hasPermission(PermissionsList.Client.Upload);
  const canDownload = hasPermission(PermissionsList.Client.Download);
  const canDeleteFile = hasPermission(PermissionsList.Client.DeleteFile);

  const filesQuery = useGetClientFiles(clientId, canGetFiles);
  const uploadMutation = useUploadClientFiles();
  const downloadMutation = useDownloadClientFile();
  const deleteMutation = useDeleteClientFile();

  const [pendingUploads, setPendingUploads] = useState<TPendingClientUpload[]>(
    [],
  );
  const [deletingFile, setDeletingFile] = useState<TClientFile | null>(null);
  const [fileAction, setFileAction] = useState<ClientFileAction | null>(null);
  const [previewFile, setPreviewFile] = useState<TClientFile | null>(null);
  const [previewSourceUrl, setPreviewSourceUrl] = useState<string | null>(null);
  const [previewResolving, setPreviewResolving] = useState(false);

  const files =
    filesQuery.data?.isSuccess && Array.isArray(filesQuery.data.data)
      ? filesQuery.data.data
      : [];

  const canSubmitUpload =
    canUpload &&
    !uploadMutation.isPending &&
    pendingUploads.length > 0 &&
    pendingUploads.every((item) => item.name.trim().length > 0);

  const addPendingFiles = (selected: File[]) => {
    if (!canUpload || uploadMutation.isPending || selected.length === 0) return;

    setPendingUploads((current) => [
      ...current,
      ...selected.map((file) => ({
        key: nextPendingKey(),
        file,
        name: file.name,
        description: "",
      })),
    ]);
  };

  const updatePendingUpload = (
    key: string,
    patch: Partial<Pick<TPendingClientUpload, "name" | "description">>,
  ) => {
    setPendingUploads((current) =>
      current.map((item) =>
        item.key === key ? { ...item, ...patch } : item,
      ),
    );
  };

  const removePendingUpload = (key: string) => {
    if (uploadMutation.isPending) return;
    setPendingUploads((current) => current.filter((item) => item.key !== key));
  };

  const clearPendingUploads = () => {
    if (uploadMutation.isPending) return;
    setPendingUploads([]);
  };

  const submitUpload = async () => {
    if (!canSubmitUpload) return;

    const batch = pendingUploads;
    try {
      const response = await uploadMutation.mutateAsync({
        clientId,
        files: batch.map((item) => item.file),
        names: batch.map((item) => item.name.trim()),
        descriptions: batch.map((item) => item.description.trim()),
      });
      if (!response.isSuccess) {
        toast.error(response.message || t("clients.files.uploadFailed"));
        return;
      }
      toast.success(response.message || t("clients.files.uploadSuccess"));
      setPendingUploads([]);
      await invalidateClientFiles(clientId);
    } catch {
      toast.error(t("clients.files.uploadFailed"));
    }
  };

  const resolveFileUrl = async (file: TClientFile) => {
    if (file.url?.trim()) {
      return {
        url: file.url.trim(),
        fileName: file.fileName,
      };
    }
    if (!canDownload) return null;
    const response = await downloadMutation.mutateAsync(file.fileId);
    if (!response.isSuccess || !response.data?.url) return null;
    return {
      url: response.data.url,
      fileName: response.data.fileName || file.fileName,
    };
  };

  const closePreview = () => {
    setPreviewFile(null);
    setPreviewSourceUrl(null);
    setPreviewResolving(false);
  };

  const viewFile = async (file: TClientFile) => {
    if (fileAction) return;
    setFileAction({ fileId: file.fileId, kind: "view" });
    setPreviewFile(file);
    setPreviewSourceUrl(null);
    setPreviewResolving(true);
    try {
      const resolved = await resolveFileUrl(file);
      if (!resolved?.url) {
        toast.error(t("clients.files.downloadFailed"));
        closePreview();
        return;
      }
      setPreviewFile({
        ...file,
        fileName: resolved.fileName || file.fileName,
      });
      setPreviewSourceUrl(resolved.url);
      setPreviewResolving(false);
    } catch {
      toast.error(t("clients.files.downloadFailed"));
      closePreview();
    } finally {
      setFileAction(null);
    }
  };

  const downloadFile = async (file: TClientFile) => {
    if (!canDownload || fileAction) return;
    setFileAction({ fileId: file.fileId, kind: "download" });
    try {
      const resolved = await resolveFileUrl(file);
      if (!resolved?.url) {
        toast.error(t("clients.files.downloadFailed"));
        return;
      }
      await downloadClientFileFromUrl(
        resolved.url,
        resolved.fileName || file.fileName || "download",
      );
    } catch {
      toast.error(t("clients.files.downloadFailed"));
    } finally {
      setFileAction(null);
    }
  };

  const openDelete = (file: TClientFile) => {
    if (!canDeleteFile) return;
    setDeletingFile(file);
  };

  const closeDelete = () => {
    if (deleteMutation.isPending) return;
    setDeletingFile(null);
  };

  const confirmDelete = async () => {
    if (!canDeleteFile || !deletingFile || deleteMutation.isPending) return;
    try {
      const response = await deleteMutation.mutateAsync(deletingFile.fileId);
      if (!response.isSuccess) {
        toast.error(response.message || t("clients.files.deleteFailed"));
        return;
      }
      toast.success(response.message || t("clients.files.deleteSuccess"));
      setDeletingFile(null);
      await invalidateClientFiles(clientId);
    } catch {
      toast.error(t("clients.files.deleteFailed"));
    }
  };

  return {
    canGetFiles,
    canUpload,
    canDownload,
    canDeleteFile,
    files,
    filesQuery,
    pendingUploads,
    canSubmitUpload,
    deletingFile,
    fileAction,
    previewFile,
    previewSourceUrl,
    previewResolving,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    addPendingFiles,
    updatePendingUpload,
    removePendingUpload,
    clearPendingUploads,
    submitUpload,
    viewFile,
    closePreview,
    downloadFile,
    openDelete,
    closeDelete,
    confirmDelete,
  };
};
