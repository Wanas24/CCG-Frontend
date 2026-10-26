import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import {
  AppButton,
  AppCheckBox,
  AppDialog,
  AppDropDownSelect,
  AppInput,
} from "@/shared/ANTD_UIComponents";
import type { TLayout } from "@/modules/reportLayout/types";
import {
  CLIENT_EXPORT_COLUMN_GROUPS,
  CLIENT_EXPORT_FORMAT_OPTIONS,
  ClientExportFormat,
  type TClientExportColumn,
  type TClientExportFormat,
} from "../constants/clientExport";

type Props = {
  open: boolean;
  loading?: boolean;
  layoutsLoading?: boolean;
  layoutsError?: boolean;
  lastUsedLoading?: boolean;
  format: TClientExportFormat;
  layoutId: string;
  title: string;
  columns: TClientExportColumn[];
  layouts: TLayout[];
  lastUsedName: string | null;
  selectedLayout: TLayout | null;
  onFormatChange: (format: TClientExportFormat) => void;
  onLayoutChange: (layoutId: string) => void;
  onTitleChange: (title: string) => void;
  onToggleColumn: (column: TClientExportColumn) => void;
  onSelectAllColumns: () => void;
  onSelectEssentialColumns: () => void;
  onClearColumns: () => void;
  onSubmit: () => void;
  onClose: () => void;
};

const ClientExportDialog = ({
  open,
  loading,
  layoutsLoading,
  layoutsError,
  lastUsedLoading,
  format,
  layoutId,
  title,
  columns,
  layouts,
  lastUsedName,
  selectedLayout,
  onFormatChange,
  onLayoutChange,
  onTitleChange,
  onToggleColumn,
  onSelectAllColumns,
  onSelectEssentialColumns,
  onClearColumns,
  onSubmit,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  const formatOptions = CLIENT_EXPORT_FORMAT_OPTIONS.map((value) => ({
    value,
    label:
      value === ClientExportFormat.Excel
        ? t("clients.export.formatExcel")
        : value === ClientExportFormat.Pdf
          ? t("clients.export.formatPdf")
          : t("clients.export.formatWord"),
  }));

  const layoutOptions = [
    { value: "", label: t("clients.export.defaultLayout") },
    ...layouts.map((layout) => {
      const marks = [
        layout.isDefault ? t("reportLayout.badges.default") : "",
        layout.isSystem ? t("reportLayout.badges.system") : "",
      ]
        .filter(Boolean)
        .join(", ");
      return {
        value: layout.id,
        label: marks ? `${layout.name} (${marks})` : layout.name,
      };
    }),
  ];

  const layoutHint = layoutId
    ? selectedLayout
      ? t("clients.export.selectedLayoutHint", {
          name: selectedLayout.name,
        })
      : t("clients.export.selectedLayoutMissing")
    : lastUsedName
      ? t("clients.export.defaultLayoutHintWithLast", {
          name: lastUsedName,
        })
      : t("clients.export.defaultLayoutHint");

  return (
    <AppDialog
      open={open}
      title={t("clients.export.title")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={720}
    >
      <p className={`m-0 mb-4 text-sm ${DesignTokens.typography.muted}`}>
        {t("clients.export.subtitle")}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AppDropDownSelect
          label={t("clients.export.format")}
          value={format}
          options={formatOptions}
          disabled={loading}
          onChange={(value) => {
            if (typeof value === "number") {
              onFormatChange(value as TClientExportFormat);
            }
          }}
        />
        <AppDropDownSelect
          label={t("clients.export.layout")}
          value={layoutId}
          options={layoutOptions}
          loading={layoutsLoading}
          disabled={loading}
          showSearch
          optionFilterProp="label"
          onChange={(value) =>
            onLayoutChange(typeof value === "string" ? value : "")
          }
        />
        <div className="sm:col-span-2">
          <AppInput
            label={t("clients.export.exportTitle")}
            value={title}
            disabled={loading}
            placeholder={t("clients.export.exportTitlePlaceholder")}
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </div>
      </div>

      <p className={`m-0 mt-3 text-xs ${DesignTokens.typography.muted}`}>
        {layoutsError
          ? t("clients.export.layoutsLoadError")
          : lastUsedLoading
            ? t("clients.export.layoutHintLoading")
            : layoutHint}
      </p>

      <div className="mt-4 rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="m-0 text-sm font-semibold text-(--app-text)">
              {t("clients.export.columnsTitle")}
            </p>
            <p className={`m-0 mt-0.5 text-xs ${DesignTokens.typography.muted}`}>
              {t("clients.export.columnsCount", {
                count: columns.length,
                total: CLIENT_EXPORT_COLUMN_GROUPS.flatMap(
                  (group) => group.columns,
                ).length,
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AppButton
              variant="secondary"
              className="w-fit!"
              disabled={loading}
              onClick={onSelectAllColumns}
            >
              {t("clients.export.columnsAll")}
            </AppButton>
            <AppButton
              variant="secondary"
              className="w-fit!"
              disabled={loading}
              onClick={onSelectEssentialColumns}
            >
              {t("clients.export.columnsEssentials")}
            </AppButton>
            <AppButton
              variant="secondary"
              className="w-fit!"
              disabled={loading}
              onClick={onClearColumns}
            >
              {t("clients.export.columnsNone")}
            </AppButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {CLIENT_EXPORT_COLUMN_GROUPS.map((group) => (
            <div
              key={group.id}
              className="rounded-xl border border-(--Grey300) bg-(--app-surface) p-3"
            >
              <p className="m-0 mb-2 text-xs font-bold uppercase tracking-wide text-(--Grey600)">
                {t(`clients.export.columnGroups.${group.id}`)}
              </p>
              <div className="flex flex-col gap-1.5">
                {group.columns.map((column) => (
                  <AppCheckBox
                    key={column}
                    checked={columns.includes(column)}
                    disabled={loading}
                    onChange={() => onToggleColumn(column)}
                  >
                    {t(`clients.export.columnLabels.${column}`)}
                  </AppCheckBox>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" disabled={loading} onClick={onClose}>
          {t("clients.export.cancel")}
        </AppButton>
        <AppButton loading={loading} onClick={onSubmit}>
          {t("clients.export.submit")}
        </AppButton>
      </div>
    </AppDialog>
  );
};

export default ClientExportDialog;
