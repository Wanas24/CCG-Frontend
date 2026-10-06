import type { BaseSyntheticEvent } from "react";
import { useRef } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Download, FileText } from "lucide-react";
import {
  AppButton,
  AppDrawer,
  AppDropDownSelect,
  AppInput,
  AppTextArea,
  AppUpload,
} from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useTranslatedFormError } from "@/shared/validation";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useGetItemCategoryFiles } from "../api/hooks/useGetItemCategoryFiles";
import type { ItemCategoryFormValues } from "../schemas/itemCategoryFormSchema";
import type {
  TItemCategory,
  TItemCategoryFile,
  TItemCategoryType,
} from "../types/itemCategory";
import type { TMeasurement } from "../../units/types/measurement";

type Props = {
  open: boolean;
  form: UseFormReturn<ItemCategoryFormValues>;
  editingItem: TItemCategory | null;
  activeItemId: number | null;
  types: TItemCategoryType[];
  units: TMeasurement[];
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canGetFiles: boolean;
  canUpload: boolean;
  canDownload: boolean;
  canDeleteFile: boolean;
  isSaving: boolean;
  isUploading: boolean;
  isDownloading: boolean;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  onDelete: () => void;
  onUpload: (files: File[]) => void;
  onDownload: (file: TItemCategoryFile) => void;
  onDeleteFile: (file: TItemCategoryFile) => void;
};

const formatFileSize = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB"];
  let size = Number(bytes) || 0;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${index ? size.toFixed(1) : size} ${units[index]}`;
};

const ItemCategoryDrawer = ({
  open,
  form,
  editingItem,
  activeItemId,
  types,
  units,
  canEdit,
  canCreate,
  canDelete,
  canGetFiles,
  canUpload,
  canDownload,
  canDeleteFile,
  isSaving,
  isUploading,
  isDownloading,
  onSubmit,
  onClose,
  onDelete,
  onUpload,
  onDownload,
  onDeleteFile,
}: Props) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const isExisting = activeItemId !== null;
  const canSave = isExisting ? canEdit : canCreate;
  const pendingUploadsRef = useRef<File[]>([]);
  const uploadFlushTimerRef = useRef<number | null>(null);

  const filesQuery = useGetItemCategoryFiles(
    activeItemId,
    open && isExisting && canGetFiles,
  );
  const files =
    filesQuery.data?.isSuccess && Array.isArray(filesQuery.data.data)
      ? filesQuery.data.data
      : [];

  const queueUpload = (file: File) => {
    pendingUploadsRef.current.push(file);
    if (uploadFlushTimerRef.current !== null) {
      window.clearTimeout(uploadFlushTimerRef.current);
    }
    uploadFlushTimerRef.current = window.setTimeout(() => {
      const batch = pendingUploadsRef.current;
      pendingUploadsRef.current = [];
      uploadFlushTimerRef.current = null;
      if (batch.length > 0) {
        onUpload(batch);
      }
    }, 0);
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={560}
      title={
        isExisting
          ? t("lists.itemCatalog.drawerEditTitle")
          : t("lists.itemCatalog.drawerCreateTitle")
      }
      destroyOnHidden
      footer={
        <div className="flex items-center gap-2">
          <AppButton variant="secondary" onClick={onClose}>
            {t("lists.common.close")}
          </AppButton>
          <div className="flex-1" />
          {isExisting && canDelete && editingItem ? (
            <AppButton variant="delete" onClick={onDelete}>
              {t("lists.itemCatalog.delete")}
            </AppButton>
          ) : null}
          {canSave ? (
            <AppButton
              htmlType="submit"
              form="item-category-form"
              loading={isSaving}
            >
              {isExisting
                ? t("lists.itemCatalog.save")
                : t("lists.itemCatalog.create")}
            </AppButton>
          ) : null}
        </div>
      }
    >
      <p className={`m-0 mb-4 ${DesignTokens.typography.muted}`}>
        {isExisting
          ? t("lists.itemCatalog.drawerEditSubtitle")
          : t("lists.itemCatalog.drawerCreateSubtitle")}
      </p>

      <form
        id="item-category-form"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="sm:col-span-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <AppInput
                {...field}
                required
                disabled={!canSave}
                label={t("lists.itemCatalog.nameLabel")}
                placeholder={t("lists.itemCatalog.namePlaceholder")}
                maxLength={200}
                errorMsg={translateError(fieldState.error?.message)}
              />
            )}
          />
        </div>
        <Controller
          name="type"
          control={form.control}
          render={({ field, fieldState }) => (
            <AppDropDownSelect
              required
              disabled={!canSave}
              label={t("lists.itemCatalog.typeLabel")}
              placeholder={t("lists.itemCatalog.typePlaceholder")}
              value={field.value || undefined}
              onChange={(value) => field.onChange(Number(value))}
              options={types.map((type) => ({
                value: type.value,
                label: type.name,
              }))}
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          name="unitId"
          control={form.control}
          render={({ field, fieldState }) => (
            <AppDropDownSelect
              required
              disabled={!canSave}
              label={t("lists.itemCatalog.unitLabel")}
              placeholder={t("lists.itemCatalog.unitPlaceholder")}
              value={field.value || undefined}
              onChange={(value) => field.onChange(Number(value))}
              options={units.map((unit) => ({
                value: unit.id,
                label: unit.unit,
              }))}
              showSearch
              optionFilterProp="label"
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
        <div className="sm:col-span-2">
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <AppTextArea
                {...field}
                disabled={!canSave}
                label={t("lists.itemCatalog.descriptionLabel")}
                placeholder={t("lists.itemCatalog.descriptionPlaceholder")}
                maxLength={1000}
                rows={3}
                errorMsg={translateError(fieldState.error?.message)}
              />
            )}
          />
        </div>
        <div className="sm:col-span-2">
          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <AppTextArea
                {...field}
                disabled={!canSave}
                label={t("lists.itemCatalog.notesLabel")}
                placeholder={t("lists.itemCatalog.notesPlaceholder")}
                maxLength={1000}
                rows={3}
                errorMsg={translateError(fieldState.error?.message)}
              />
            )}
          />
        </div>
      </form>

      {editingItem?.addedBy ? (
        <p className="mt-3 mb-0 text-xs text-(--Grey500)">
          {t("lists.itemCatalog.addedBy", { name: editingItem.addedBy })}
        </p>
      ) : null}

      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="m-0 text-sm font-semibold text-(--app-text)">
            {t("lists.itemCatalog.filesTitle")}
          </h3>
          {isExisting ? (
            <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
              {files.length}
            </span>
          ) : null}
        </div>

        {!isExisting ? (
          <p className="m-0 rounded-xl border border-(--statusB200)/30 bg-(--statusB100) px-3 py-2 text-sm text-(--statusB200)">
            {t("lists.itemCatalog.filesHint")}
          </p>
        ) : !canGetFiles ? null : filesQuery.isError ||
          (filesQuery.data && !filesQuery.data.isSuccess) ? (
          <AppErrorContainer
            error={
              filesQuery.data?.message ?? t("lists.itemCatalog.filesLoadError")
            }
          />
        ) : filesQuery.isPending ? (
          <p className={`m-0 ${DesignTokens.typography.muted}`}>
            {t("common.loading")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {files.length === 0 ? (
              <p className={`m-0 ${DesignTokens.typography.muted}`}>
                {t("lists.itemCatalog.filesEmpty")}
              </p>
            ) : (
              files.map((file) => (
                <div
                  key={file.fileId}
                  className="flex items-center gap-2 rounded-xl border border-(--Grey300) bg-(--Grey100) p-2.5"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--Primary100) text-(--Primary400)">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-sm font-medium text-(--app-text)">
                      {file.fileName}
                    </p>
                    <p className="m-0 text-[11px] text-(--Grey500)">
                      {formatFileSize(file.fileSize)}
                    </p>
                  </div>
                  {canDownload ? (
                    <AppButton
                      variant="default"
                      padding="none"
                      className="size-8!"
                      loading={isDownloading}
                      aria-label={t("lists.itemCatalog.download")}
                      onClick={() => onDownload(file)}
                    >
                      <Download size={16} />
                    </AppButton>
                  ) : null}
                  {canDeleteFile ? (
                    <AppButton
                      variant="delete"
                      padding="none"
                      className="size-8!"
                      aria-label={t("lists.itemCatalog.deleteFile")}
                      onClick={() => onDeleteFile(file)}
                    />
                  ) : null}
                </div>
              ))
            )}

            {canUpload ? (
              <AppUpload
                multiple
                showUploadList={false}
                disabled={isUploading}
                beforeUpload={(file) => {
                  queueUpload(file);
                  return false;
                }}
              />
            ) : null}
          </div>
        )}
      </div>
    </AppDrawer>
  );
};

export default ItemCategoryDrawer;
