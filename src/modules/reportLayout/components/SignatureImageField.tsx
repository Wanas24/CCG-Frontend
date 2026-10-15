import { useRef, useState } from "react";
import clsx from "clsx";
import { Eye, ImageIcon, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LAYOUT_IMAGES_PAGE_SIZE } from "@/lib/api/pagination";
import AppChevron from "@/shared/ANTD_UIComponents/AppChevron/AppChevron";
import { useReportLayoutSignatureImage } from "../hooks/useReportLayoutSignatureImage";
import { safeMediaUrl } from "../utils/paperGeometry";

type Props = {
  value: string;
  onChange: (imageUrl: string | null) => void;
  onRemoved: (imageUrl: string) => void;
  label?: string;
  help?: string;
};

const actionClass =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-[9px] border border-(--Grey300) bg-(--app-surface) px-2.5 py-1.5 text-xs font-semibold text-(--app-text) disabled:pointer-events-none disabled:opacity-45";

const SignatureImageField = ({
  value,
  onChange,
  onRemoved,
  label,
  help,
}: Props) => {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryPage, setLibraryPage] = useState(1);
  const {
    upload,
    remove,
    uploadIssues,
    isUploading,
    deletingFileId,
    isLoadingImages,
    images,
  } = useReportLayoutSignatureImage(libraryOpen);
  const preview = safeMediaUrl(value);
  const hasImage = value.trim().length > 0;
  const libraryPageCount = Math.max(
    1,
    Math.ceil(images.length / DEFAULT_LAYOUT_IMAGES_PAGE_SIZE),
  );
  const libraryCurrentPage = Math.min(libraryPage, libraryPageCount);
  const libraryImages = images.slice(
    (libraryCurrentPage - 1) * DEFAULT_LAYOUT_IMAGES_PAGE_SIZE,
    libraryCurrentPage * DEFAULT_LAYOUT_IMAGES_PAGE_SIZE,
  );
  const fieldLabel = label ?? t("reportLayout.signature.imageUrl");
  const fieldHelp = help ?? t("reportLayout.signature.imageHelp");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const url = await upload(file);
      if (url) onChange(url);
    } catch {
      return;
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="col-span-2">
      <span className="mb-1 block text-[11px] font-semibold text-(--Grey600)">
        {fieldLabel}
      </span>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2.5">
          <div
            className={clsx(
              "relative h-[72px] w-[112px] shrink-0 overflow-hidden rounded-[10px] border bg-(--Grey100)",
              preview
                ? "border-(--Grey300)"
                : "border-dashed border-(--Grey300)",
            )}
          >
            {preview ? (
              <img
                src={preview}
                alt=""
                className="absolute inset-0 size-full object-contain p-1.5"
              />
            ) : (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center text-[10px] font-medium text-(--Grey500)">
                <ImageIcon size={16} aria-hidden className="opacity-70" />
                {t("reportLayout.signature.imageEmpty")}
              </span>
            )}
            {isUploading ? (
              <span className="absolute inset-0 grid place-items-center bg-(--app-surface)/70 text-[10px] font-semibold text-(--Grey600)">
                {t("reportLayout.signature.uploading")}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <label
              className={clsx(
                actionClass,
                isUploading && "pointer-events-none opacity-45",
                uploadIssues.length > 0 && "border-(--statusR200)",
              )}
            >
              <Plus size={14} aria-hidden />
              {isUploading
                ? t("reportLayout.signature.uploading")
                : hasImage
                  ? t("reportLayout.signature.replaceImage")
                  : t("reportLayout.signature.uploadImage")}
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,.bmp,image/jpeg,image/png,image/gif,image/webp,image/bmp"
                className="hidden"
                disabled={isUploading}
                onChange={(event) => {
                  void onFile(event.target.files?.[0]);
                }}
              />
            </label>
            <button
              type="button"
              className={clsx(actionClass, libraryOpen && "border-(--Primary400)")}
              onClick={() => setLibraryOpen((open) => !open)}
            >
              <Eye size={14} aria-hidden />
              {t("reportLayout.signature.library")}
            </button>
            {hasImage ? (
              <button
                type="button"
                className={clsx(actionClass, "bg-transparent text-(--Grey600)")}
                onClick={() => onChange(null)}
              >
                <X size={14} aria-hidden />
                {t("reportLayout.signature.clearImage")}
              </button>
            ) : null}
          </div>
        </div>
        {uploadIssues.map((issue) => (
          <p
            key={issue}
            className="text-[11px] font-normal leading-snug text-(--statusR200)"
          >
            {issue}
          </p>
        ))}
        {libraryOpen ? (
          <div className="flex flex-col gap-2 rounded-xl border border-(--Grey300) bg-(--Grey100) p-2">
            {isLoadingImages ? (
              <span className="text-xs font-normal text-(--Grey500)">
                {t("reportLayout.signature.libraryLoading")}
              </span>
            ) : images.length === 0 ? (
              <span className="text-xs font-normal text-(--Grey500)">
                {t("reportLayout.signature.libraryEmpty")}
              </span>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {libraryImages.map((image) => {
                  const src = safeMediaUrl(image.url);
                  const selected = value.trim() === image.url;
                  const isDeleting = deletingFileId === image.fileId;
                  return (
                    <span key={image.fileId} className="relative">
                      <button
                        type="button"
                        title={image.fileName}
                        disabled={isDeleting}
                        className={clsx(
                          "grid aspect-square w-full place-items-center rounded-lg border bg-(--app-surface) p-1 disabled:opacity-45",
                          selected
                            ? "border-(--Primary400) shadow-[0_0_0_1px_var(--Primary400)]"
                            : "border-(--Grey300)",
                        )}
                        onClick={() => onChange(image.url)}
                      >
                        {src ? (
                          <img
                            src={src}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="max-w-full truncate px-1 text-[10px] font-normal">
                            {image.fileName}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        aria-label={t("reportLayout.signature.deleteImage")}
                        title={t("reportLayout.signature.deleteImage")}
                        className="absolute end-1 top-1 grid size-4 place-items-center rounded-full border border-(--app-surface) bg-(--statusR200) text-[10px] leading-none text-(--app-surface) disabled:opacity-45"
                        disabled={isDeleting || isUploading}
                        onClick={() => {
                          void remove(image.fileId).then((removed) => {
                            if (removed) onRemoved(image.url);
                          });
                        }}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            {libraryPageCount > 1 ? (
              <div className="flex items-center justify-center gap-2 border-t border-(--Grey300) pt-2">
                <button
                  type="button"
                  aria-label={t("reportLayout.signature.libraryPrevious")}
                  className="grid size-7 cursor-pointer place-items-center rounded-lg border border-(--Grey300) bg-(--app-surface) text-(--app-text) disabled:cursor-default disabled:opacity-40"
                  disabled={libraryCurrentPage <= 1}
                  onClick={() => setLibraryPage(libraryCurrentPage - 1)}
                >
                  <AppChevron
                    direction="previous"
                    size={14}
                    className="pointer-events-none"
                  />
                </button>
                <span className="min-w-12 text-center text-[11px] font-semibold text-(--Grey600)">
                  {t("reportLayout.signature.libraryPage", {
                    page: libraryCurrentPage,
                    total: libraryPageCount,
                  })}
                </span>
                <button
                  type="button"
                  aria-label={t("reportLayout.signature.libraryNext")}
                  className="grid size-7 cursor-pointer place-items-center rounded-lg border border-(--Grey300) bg-(--app-surface) text-(--app-text) disabled:cursor-default disabled:opacity-40"
                  disabled={libraryCurrentPage >= libraryPageCount}
                  onClick={() => setLibraryPage(libraryCurrentPage + 1)}
                >
                  <AppChevron
                    direction="next"
                    size={14}
                    className="pointer-events-none"
                  />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className="mt-1 text-[11px] font-normal leading-snug text-(--Grey500)">
        {fieldHelp}
      </p>
    </div>
  );
};

export default SignatureImageField;
