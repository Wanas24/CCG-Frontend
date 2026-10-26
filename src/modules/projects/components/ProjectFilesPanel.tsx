import { Download, Eye, FileText, FolderOpen, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import {
  AppButton,
  AppInput,
  AppSkeleton,
  AppTextArea,
  AppUpload,
} from "@/shared/ANTD_UIComponents";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import FilePreviewDialog from "@/shared/components/FilePreviewDialog";
import { useProjectFilesManager } from "../hooks/useProjectFilesManager";
import { formatProjectFileSize } from "../utils/projectFileDownload";
import ProjectFileDeleteDialog from "./ProjectFileDeleteDialog";

type Props = {
  projectId: number;
};

const ProjectFilesPanel = ({ projectId }: Props) => {
  const { t, i18n } = useTranslation();
  const manager = useProjectFilesManager(projectId);

  if (!manager.canGetFiles) {
    return (
      <AppEmptyState
        icon={<FolderOpen size={DesignTokens.media.iconMd} />}
        title={t("projects.files.title")}
        description={t("projects.files.noAccess")}
      />
    );
  }

  const { filesQuery } = manager;
  const loadError =
    filesQuery.isError ||
    (filesQuery.data != null && !filesQuery.data.isSuccess);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="m-0 text-base font-semibold text-(--app-text)">
              {t("projects.files.title")}
            </h2>
            <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
              {manager.files.length}
            </span>
          </div>
          <p className={`m-0 mt-1 text-sm ${DesignTokens.typography.muted}`}>
            {t("projects.files.subtitle")}
          </p>
        </div>
      </div>

      {manager.canUpload ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3 sm:p-4">
          <AppUpload
            multiple
            showUploadList={false}
            disabled={manager.isUploading}
            beforeUpload={(file) => {
              manager.addPendingFiles([file as File]);
              return false;
            }}
          />
          <p className={`m-0 text-xs ${DesignTokens.typography.muted}`}>
            {t("projects.files.uploadHint")}
          </p>

          {manager.pendingUploads.length > 0 ? (
            <div className="flex flex-col gap-3">
              {manager.pendingUploads.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-3 rounded-xl border border-(--Grey300) bg-(--app-surface) p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className="m-0 truncate text-sm font-medium text-(--app-text)"
                        dir="auto"
                      >
                        {item.file.name}
                      </p>
                      <p className="m-0 text-[11px] text-(--Grey500)">
                        {formatProjectFileSize(item.file.size) ||
                          t("projects.files.pendingFile")}
                      </p>
                    </div>
                    <AppButton
                      variant="default"
                      padding="none"
                      className="size-8! text-(--Grey600)! hover:text-(--app-text)!"
                      disabled={manager.isUploading}
                      icon={<X size={16} />}
                      aria-label={t("projects.files.removePending")}
                      onClick={() => manager.removePendingUpload(item.key)}
                    />
                  </div>
                  <AppInput
                    label={t("projects.files.name")}
                    required
                    value={item.name}
                    disabled={manager.isUploading}
                    placeholder={t("projects.files.namePlaceholder")}
                    errorMsg={
                      item.name.trim()
                        ? undefined
                        : t("projects.files.nameRequired")
                    }
                    onChange={(event) =>
                      manager.updatePendingUpload(item.key, {
                        name: event.target.value,
                      })
                    }
                  />
                  <AppTextArea
                    label={t("projects.files.description")}
                    value={item.description}
                    disabled={manager.isUploading}
                    rows={2}
                    placeholder={t("projects.files.descriptionPlaceholder")}
                    onChange={(event) =>
                      manager.updatePendingUpload(item.key, {
                        description: event.target.value,
                      })
                    }
                  />
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                <AppButton
                  className="w-fit!"
                  loading={manager.isUploading}
                  disabled={!manager.canSubmitUpload}
                  onClick={() => {
                    void manager.submitUpload();
                  }}
                >
                  {t("projects.files.upload")}
                </AppButton>
                <AppButton
                  variant="secondary"
                  className="w-fit!"
                  disabled={manager.isUploading}
                  onClick={manager.clearPendingUploads}
                >
                  {t("projects.files.clearPending")}
                </AppButton>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {loadError ? (
        <div className="flex flex-col gap-3">
          <AppErrorContainer
            error={filesQuery.data?.message ?? t("projects.files.loadError")}
          />
          <AppButton
            variant="secondary"
            className="w-fit!"
            loading={filesQuery.isFetching}
            onClick={() => {
              void filesQuery.refetch();
            }}
          >
            {t("projects.retry")}
          </AppButton>
        </div>
      ) : filesQuery.isPending ? (
        <div className="flex flex-col gap-2">
          <AppSkeleton.Input active className="!h-14 !w-full !min-w-0" />
          <AppSkeleton.Input active className="!h-14 !w-full !min-w-0" />
          <AppSkeleton.Input active className="!h-14 !w-full !min-w-0" />
        </div>
      ) : manager.files.length === 0 ? (
        <AppEmptyState
          icon={<FolderOpen size={DesignTokens.media.iconMd} />}
          title={t("projects.files.emptyTitle")}
          description={t("projects.files.emptyDescription")}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {manager.files.map((file) => {
            const sizeLabel = formatProjectFileSize(file.fileSize);
            const uploadedLabel = file.uploadedAt
              ? new Date(file.uploadedAt).toLocaleString(i18n.language)
              : "";
            const meta = [sizeLabel, uploadedLabel, file.description?.trim()]
              .filter(Boolean)
              .join(" · ");

            return (
              <div
                key={file.fileId}
                className="flex items-center gap-2 rounded-xl border border-(--Grey300) bg-(--Grey100) p-2.5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--Primary100) text-(--Primary400)">
                  <FileText size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="m-0 truncate text-sm font-medium text-(--app-text)"
                    dir="auto"
                  >
                    {file.fileName}
                  </p>
                  {meta ? (
                    <p
                      className="m-0 truncate text-[11px] text-(--Grey500)"
                      dir="auto"
                    >
                      {meta}
                    </p>
                  ) : null}
                </div>
                {manager.canDownload || Boolean(file.url?.trim()) ? (
                  <AppButton
                    variant="default"
                    padding="none"
                    className="size-8! text-(--Grey600)! hover:text-(--app-text)!"
                    loading={
                      manager.fileAction?.fileId === file.fileId &&
                      manager.fileAction.kind === "view"
                    }
                    disabled={Boolean(manager.fileAction)}
                    icon={<Eye size={16} />}
                    aria-label={t("projects.files.view")}
                    onClick={() => {
                      void manager.viewFile(file);
                    }}
                  />
                ) : null}
                {manager.canDownload ? (
                  <AppButton
                    variant="default"
                    padding="none"
                    className="size-8! text-(--Grey600)! hover:text-(--app-text)!"
                    loading={
                      manager.fileAction?.fileId === file.fileId &&
                      manager.fileAction.kind === "download"
                    }
                    disabled={Boolean(manager.fileAction)}
                    icon={<Download size={16} />}
                    aria-label={t("projects.files.download")}
                    onClick={() => {
                      void manager.downloadFile(file);
                    }}
                  />
                ) : null}
                {manager.canDeleteFile ? (
                  <AppButton
                    variant="delete"
                    padding="none"
                    className="size-8!"
                    icon={<Trash2 size={16} />}
                    aria-label={t("projects.files.delete")}
                    onClick={() => manager.openDelete(file)}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <ProjectFileDeleteDialog
        file={manager.deletingFile}
        loading={manager.isDeleting}
        onConfirm={() => {
          void manager.confirmDelete();
        }}
        onClose={manager.closeDelete}
      />

      <FilePreviewDialog
        open={Boolean(manager.previewFile)}
        fileName={manager.previewFile?.fileName ?? ""}
        sourceUrl={manager.previewSourceUrl}
        mimeHint={manager.previewFile?.fileType}
        resolvingSource={manager.previewResolving}
        canDownload={manager.canDownload}
        downloading={
          manager.previewFile != null &&
          manager.fileAction?.fileId === manager.previewFile.fileId &&
          manager.fileAction.kind === "download"
        }
        onDownload={
          manager.canDownload
            ? () => {
                const file = manager.previewFile;
                if (!file) return;
                void manager.downloadFile(file);
              }
            : undefined
        }
        onClose={manager.closePreview}
      />
    </div>
  );
};

export default ProjectFilesPanel;
