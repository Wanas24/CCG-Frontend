import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileWarning } from "lucide-react";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { fetchFileAsObjectUrl } from "@/lib/files/fetchFileAsObjectUrl";
import { resolveAbsoluteFileUrl } from "@/lib/files/resolveAbsoluteFileUrl";
import {
  resolveFilePreviewKind,
  type FilePreviewKind,
} from "@/lib/files/resolveFilePreviewKind";
import { AppButton, AppDialog, AppSkeleton } from "@/shared/ANTD_UIComponents";
import "./FilePreviewDialog.css";

export type FilePreviewDialogProps = {
  open: boolean;
  fileName: string;
  sourceUrl: string | null;
  mimeHint?: string | null;
  resolvingSource?: boolean;
  canDownload?: boolean;
  downloading?: boolean;
  onDownload?: () => void;
  onClose: () => void;
};

type PreviewSource = {
  url: string;
  mimeType: string;
  isObjectUrl: boolean;
};

type BodyProps = {
  fileName: string;
  sourceUrl: string | null;
  mimeHint?: string | null;
  resolvingSource: boolean;
  canDownload: boolean;
  downloading: boolean;
  onDownload?: () => void;
  onClose: () => void;
};

const FilePreviewBody = ({
  fileName,
  sourceUrl,
  mimeHint,
  resolvingSource,
  canDownload,
  downloading,
  onDownload,
  onClose,
}: BodyProps) => {
  const { t } = useTranslation();
  const [previewSource, setPreviewSource] = useState<PreviewSource | null>(
    null,
  );
  const [loadingPreview, setLoadingPreview] = useState(() =>
    Boolean(sourceUrl?.trim()),
  );
  const [loadFailed, setLoadFailed] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    const trimmed = sourceUrl?.trim();
    if (!trimmed) return;

    const controller = new AbortController();
    let active = true;
    let objectUrl: string | null = null;

    void (async () => {
      try {
        const fetched = await fetchFileAsObjectUrl(trimmed, controller.signal);
        if (!active) {
          URL.revokeObjectURL(fetched.objectUrl);
          return;
        }
        objectUrl = fetched.objectUrl;
        setPreviewSource({
          url: fetched.objectUrl,
          mimeType: fetched.mimeType,
          isObjectUrl: true,
        });
        setLoadFailed(false);
      } catch {
        if (!active || controller.signal.aborted) return;
        const directUrl = resolveAbsoluteFileUrl(trimmed);
        if (!directUrl) {
          setLoadFailed(true);
          setPreviewSource(null);
          return;
        }
        setPreviewSource({
          url: directUrl,
          mimeType: mimeHint?.trim() || "",
          isObjectUrl: false,
        });
        setLoadFailed(false);
      } finally {
        if (active) {
          setLoadingPreview(false);
        }
      }
    })();

    return () => {
      active = false;
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [mimeHint, sourceUrl]);

  const kind: FilePreviewKind = resolveFilePreviewKind({
    mimeType: previewSource?.mimeType || mimeHint,
    fileName,
  });

  const showUnsupported =
    loadFailed ||
    mediaFailed ||
    (!loadingPreview &&
      !resolvingSource &&
      Boolean(previewSource) &&
      kind === "unsupported");

  const openExternally = () => {
    const url = sourceUrl ? resolveAbsoluteFileUrl(sourceUrl) : "";
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const busy = resolvingSource || loadingPreview;

  if (busy) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center gap-3 py-6 text-center">
        <AppSkeleton.Input active className="!h-40 !w-full !max-w-md !min-w-0" />
        <p className={`m-0 text-sm ${DesignTokens.typography.muted}`}>
          {t("filePreview.loading")}
        </p>
      </div>
    );
  }

  if (showUnsupported) {
    return (
      <div className="flex min-h-56 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-(--Grey300) bg-(--Grey100)/70 px-4 py-10 text-center sm:px-8 sm:py-12">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-(--Grey300) bg-(--app-surface) text-(--Grey500)">
          <FileWarning size={DesignTokens.media.iconMd} />
        </div>
        <div className="flex w-full max-w-md flex-col items-center gap-2">
          <h3 className={`m-0 ${DesignTokens.typography.headingSm}`}>
            {t("filePreview.unavailableTitle")}
          </h3>
          <p
            className={`m-0 text-sm leading-relaxed ${DesignTokens.typography.muted}`}
          >
            {loadFailed
              ? t("filePreview.loadFailed")
              : t("filePreview.unavailableDescription")}
          </p>
          {fileName ? (
            <p
              className="m-0 mt-1 max-w-full truncate rounded-lg border border-(--Grey300) bg-(--app-surface) px-3 py-1.5 text-sm font-medium text-(--app-text)"
              dir="auto"
              title={fileName}
            >
              {fileName}
            </p>
          ) : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {canDownload && onDownload ? (
            <AppButton
              className="w-fit!"
              loading={downloading}
              onClick={onDownload}
            >
              {t("filePreview.download")}
            </AppButton>
          ) : null}
          {sourceUrl ? (
            <AppButton
              variant="secondary"
              className="w-fit!"
              onClick={openExternally}
            >
              {t("filePreview.openExternally")}
            </AppButton>
          ) : null}
          <AppButton variant="tertiary" className="w-fit!" onClick={onClose}>
            {t("filePreview.close")}
          </AppButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-40 flex-col gap-3">
      {previewSource && kind === "image" ? (
        <div className="flex min-h-40 items-center justify-center">
          <img
            src={previewSource.url}
            alt={fileName || t("filePreview.title")}
            className="max-h-[min(60vh,560px)] max-w-full object-contain"
            onError={() => setMediaFailed(true)}
          />
        </div>
      ) : previewSource && kind === "pdf" ? (
        <iframe
          title={fileName || t("filePreview.title")}
          src={previewSource.url}
          className="h-[min(60vh,560px)] w-full rounded-xl border border-(--Grey300) bg-(--app-surface)"
        />
      ) : (
        <p className={`m-0 text-center text-sm ${DesignTokens.typography.muted}`}>
          {t("filePreview.loadFailed")}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-2 border-t border-(--Grey300) pt-3">
        {canDownload && onDownload ? (
          <AppButton
            variant="secondary"
            className="w-fit!"
            loading={downloading}
            onClick={onDownload}
          >
            {t("filePreview.download")}
          </AppButton>
        ) : null}
        <AppButton className="w-fit!" onClick={onClose}>
          {t("filePreview.close")}
        </AppButton>
      </div>
    </div>
  );
};

const FilePreviewDialog = ({
  open,
  fileName,
  sourceUrl,
  mimeHint,
  resolvingSource = false,
  canDownload = false,
  downloading = false,
  onDownload,
  onClose,
}: FilePreviewDialogProps) => {
  const { t } = useTranslation();

  return (
    <AppDialog
      open={open}
      title={fileName || t("filePreview.title")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={960}
      rootClassName="file-preview-dialog"
      aria-label={t("filePreview.title")}
    >
      {open ? (
        <FilePreviewBody
          key={`${fileName}:${sourceUrl ?? "pending"}:${mimeHint ?? ""}:${resolvingSource ? "1" : "0"}`}
          fileName={fileName}
          sourceUrl={sourceUrl}
          mimeHint={mimeHint}
          resolvingSource={resolvingSource}
          canDownload={canDownload}
          downloading={downloading}
          onDownload={onDownload}
          onClose={onClose}
        />
      ) : null}
    </AppDialog>
  );
};

export default FilePreviewDialog;
