import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useDeleteProjectFile } from "../api/hooks/useDeleteProjectFile";
import { useDownloadProjectFile } from "../api/hooks/useDownloadProjectFile";
import { useGetProjectFiles } from "../api/hooks/useGetProjectFiles";
import { useUploadProjectFiles } from "../api/hooks/useUploadProjectFiles";
import { invalidateProjectFiles } from "../api/queryKeys/projectQueryKeys";
import type { TProjectFile } from "../types/projectFile";
import { downloadProjectFileFromUrl } from "../utils/projectFileDownload";

export type ProjectFileAction = {
  fileId: number;
  kind: "view" | "download";
};

export const useProjectFilesManager = (projectId: number) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const canGetFiles = hasPermission(PermissionsList.Project.GetFiles);
  const canUpload = hasPermission(PermissionsList.Project.Upload);
  const canDownload = hasPermission(PermissionsList.Project.Download);
  const canDeleteFile = hasPermission(PermissionsList.Project.DeleteFile);

  const filesQuery = useGetProjectFiles(projectId, canGetFiles);
  const uploadMutation = useUploadProjectFiles();
  const downloadMutation = useDownloadProjectFile();
  const deleteMutation = useDeleteProjectFile();

  const [description, setDescription] = useState("");
  const [deletingFile, setDeletingFile] = useState<TProjectFile | null>(null);
  const [fileAction, setFileAction] = useState<ProjectFileAction | null>(null);
  const pendingUploadsRef = useRef<File[]>([]);
  const uploadFlushTimerRef = useRef<number | null>(null);

  const files =
    filesQuery.data?.isSuccess && Array.isArray(filesQuery.data.data)
      ? filesQuery.data.data
      : [];

  const flushUploads = async () => {
    if (!canUpload || uploadMutation.isPending) return;
    const batch = pendingUploadsRef.current;
    pendingUploadsRef.current = [];
    if (batch.length === 0) return;

    const descriptions = batch.map(() => description.trim());
    try {
      const response = await uploadMutation.mutateAsync({
        projectId,
        files: batch,
        descriptions,
      });
      if (!response.isSuccess) {
        toast.error(response.message || t("projects.files.uploadFailed"));
        return;
      }
      toast.success(response.message || t("projects.files.uploadSuccess"));
      setDescription("");
      await invalidateProjectFiles(projectId);
    } catch {
      toast.error(t("projects.files.uploadFailed"));
    }
  };

  const queueUpload = (file: File) => {
    if (!canUpload || uploadMutation.isPending) return;
    pendingUploadsRef.current.push(file);
    if (uploadFlushTimerRef.current !== null) {
      window.clearTimeout(uploadFlushTimerRef.current);
    }
    uploadFlushTimerRef.current = window.setTimeout(() => {
      uploadFlushTimerRef.current = null;
      void flushUploads();
    }, 0);
  };

  const resolveFileUrl = async (file: TProjectFile) => {
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

  const viewFile = async (file: TProjectFile) => {
    if (fileAction) return;
    setFileAction({ fileId: file.fileId, kind: "view" });
    try {
      const resolved = await resolveFileUrl(file);
      if (!resolved?.url) {
        toast.error(t("projects.files.downloadFailed"));
        return;
      }
      window.open(resolved.url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error(t("projects.files.downloadFailed"));
    } finally {
      setFileAction(null);
    }
  };

  const downloadFile = async (file: TProjectFile) => {
    if (!canDownload || fileAction) return;
    setFileAction({ fileId: file.fileId, kind: "download" });
    try {
      const resolved = await resolveFileUrl(file);
      if (!resolved?.url) {
        toast.error(t("projects.files.downloadFailed"));
        return;
      }
      await downloadProjectFileFromUrl(
        resolved.url,
        resolved.fileName || file.fileName || "download",
      );
    } catch {
      toast.error(t("projects.files.downloadFailed"));
    } finally {
      setFileAction(null);
    }
  };

  const openDelete = (file: TProjectFile) => {
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
        toast.error(response.message || t("projects.files.deleteFailed"));
        return;
      }
      toast.success(response.message || t("projects.files.deleteSuccess"));
      setDeletingFile(null);
      await invalidateProjectFiles(projectId);
    } catch {
      toast.error(t("projects.files.deleteFailed"));
    }
  };

  return {
    canGetFiles,
    canUpload,
    canDownload,
    canDeleteFile,
    files,
    filesQuery,
    description,
    setDescription,
    deletingFile,
    fileAction,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    queueUpload,
    viewFile,
    downloadFile,
    openDelete,
    closeDelete,
    confirmDelete,
  };
};
