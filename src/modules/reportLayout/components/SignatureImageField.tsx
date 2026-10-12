import { useRef, useState } from "react";
import clsx from "clsx";
import { Eye, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LAYOUT_IMAGES_PAGE_SIZE } from "@/lib/api/pagination";
import AppChevron from "@/shared/ANTD_UIComponents/AppChevron/AppChevron";
import { useReportLayoutSignatureImage } from "../hooks/useReportLayoutSignatureImage";
import { safeMediaUrl } from "../utils/paperGeometry";

type Props = {
  value: string;
  onChange: (imageUrl: string | null) => void;
  onRemoved: (imageUrl: string) => void;
};

const inputClass =
  "w-full rounded-[10px] border border-(--Grey300) bg-(--Grey100) px-2.5 py-2 text-[13px] text-(--app-text) outline-none focus:border-(--Primary400)";

const actionClass =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-[9px] border border-(--Grey300) bg-(--app-surface) px-2.5 py-1.5 text-xs font-semibold text-(--app-text) disabled:pointer-events-none disabled:opacity-45";

const SignatureImageField = ({ value, onChange, onRemoved }: Props) => {
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
  const libraryPageCount = Math.max(1, Math.ceil(images.length / DEFAULT_LAYOUT_IMAGES_PAGE_SIZE));
  const libraryCurrentPage = Math.min(libraryPage, libraryPageCount);
  const libraryImages = images.slice(
    (libraryCurrentPage - 1) * DEFAULT_LAYOUT_IMAGES_PAGE_SIZE,
    libraryCurrentPage * DEFAULT_LAYOUT_IMAGES_PAGE_SIZE,
  );

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
    <div className="col-span-2 text-[11px] font-semibold text-(--Grey600)">
      {t("reportLayout.signature.imageUrl")}
      <div className="mt-1 flex flex-col gap-2">
        {preview ? (
          <img
            src={preview}
            alt=""
            className="h-[52px] w-[84px] rounded-lg border border-(--Grey300) bg-(--Grey200) object-contain"
          />
        ) : null}
        <input
          className={clsx(inputClass, "font-mono text-xs")}
          maxLength={1000}
          placeholder="https://…"
          spellCheck={false}
          value={value}
          onChange={(event) => onChange(event.target.value || null)}
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className={clsx(actionClass, libraryOpen && "border-(--Primary400)")}
            onClick={() => setLibraryOpen((open) => !open)}
          >
            <Eye size={14} />
            {t("reportLayout.signature.library")}
          </button>
          <label
            className={clsx(
              actionClass,
              isUploading && "pointer-events-none opacity-45",
              uploadIssues.length > 0 && "border-(--statusR200)",
            )}
          >
            <Plus size={14} />
            {isUploading
              ? t("reportLayout.signature.uploading")
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
          {hasImage ? (
            <button
              type="button"
              className={clsx(actionClass, "bg-transparent")}
              onClick={() => onChange(null)}
            >
              {t("reportLayout.signature.clearImage")}
            </button>
          ) : null}
        </div>
        {uploadIssues.map((issue) => (
          <p key={issue} className="text-[11px] font-normal leading-snug text-(--statusR200)">
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
                          <img src={src} alt="" className="max-h-full max-w-full object-contain" />
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
                        className="absolute end-1 top-1 grid size-4 place-items-center rounded-full border border-(--app-surface) bg-(--statusR200) text-[10px] leading-none text-white disabled:opacity-45"
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
                  <AppChevron direction="previous" size={14} className="pointer-events-none" />
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
                  <AppChevron direction="next" size={14} className="pointer-events-none" />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <span className="mt-1 block font-normal text-(--Grey500)">
        {t("reportLayout.signature.imageHelp")}
      </span>
    </div>
  );
};

export default SignatureImageField;
