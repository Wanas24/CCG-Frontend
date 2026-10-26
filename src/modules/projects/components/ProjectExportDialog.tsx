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
  PROJECT_EXPORT_COLUMN_GROUPS,
  PROJECT_EXPORT_FORMAT_OPTIONS,
  ProjectExportFormat,
  type TProjectExportColumn,
  type TProjectExportFormat,
} from "../constants/projectExport";

type Props = {
  open: boolean;
  loading?: boolean;
  layoutsLoading?: boolean;
  layoutsError?: boolean;
  lastUsedLoading?: boolean;
  format: TProjectExportFormat;
  layoutId: string;
  title: string;
  columns: TProjectExportColumn[];
  layouts: TLayout[];
  lastUsedName: string | null;
  selectedLayout: TLayout | null;
  onFormatChange: (format: TProjectExportFormat) => void;
  onLayoutChange: (layoutId: string) => void;
  onTitleChange: (title: string) => void;
  onToggleColumn: (column: TProjectExportColumn) => void;
  onSelectAllColumns: () => void;
  onSelectEssentialColumns: () => void;
  onClearColumns: () => void;
  onSubmit: () => void;
  onClose: () => void;
};

const ProjectExportDialog = ({
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

  const formatOptions = PROJECT_EXPORT_FORMAT_OPTIONS.map((value) => ({
    value,
    label:
      value === ProjectExportFormat.Excel
        ? t("projects.export.formatExcel")
        : value === ProjectExportFormat.Pdf
          ? t("projects.export.formatPdf")
          : t("projects.export.formatWord"),
  }));

  const layoutOptions = [
    { value: "", label: t("projects.export.defaultLayout") },
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
      ? t("projects.export.selectedLayoutHint", {
          name: selectedLayout.name,
        })
      : t("projects.export.selectedLayoutMissing")
    : lastUsedName
      ? t("projects.export.defaultLayoutHintWithLast", {
          name: lastUsedName,
        })
      : t("projects.export.defaultLayoutHint");

  return (
    <AppDialog
      open={open}
      title={t("projects.export.title")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={720}
    >
      <p className={`m-0 mb-4 text-sm ${DesignTokens.typography.muted}`}>
        {t("projects.export.subtitle")}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AppDropDownSelect
          label={t("projects.export.format")}
          value={format}
          options={formatOptions}
          disabled={loading}
          onChange={(value) => {
            if (typeof value === "number") {
              onFormatChange(value as TProjectExportFormat);
            }
          }}
        />
        <AppDropDownSelect
          label={t("projects.export.layout")}
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
            label={t("projects.export.exportTitle")}
            value={title}
            disabled={loading}
            placeholder={t("projects.export.exportTitlePlaceholder")}
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </div>
      </div>

      <p className={`m-0 mt-3 text-xs ${DesignTokens.typography.muted}`}>
        {layoutsError
          ? t("projects.export.layoutsLoadError")
          : lastUsedLoading
            ? t("projects.export.layoutHintLoading")
            : layoutHint}
      </p>

      <div className="mt-4 rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="m-0 text-sm font-semibold text-(--app-text)">
              {t("projects.export.columnsTitle")}
            </p>
            <p className={`m-0 mt-0.5 text-xs ${DesignTokens.typography.muted}`}>
              {t("projects.export.columnsCount", {
                count: columns.length,
                total: PROJECT_EXPORT_COLUMN_GROUPS.flatMap(
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
              {t("projects.export.columnsAll")}
            </AppButton>
            <AppButton
              variant="secondary"
              className="w-fit!"
              disabled={loading}
              onClick={onSelectEssentialColumns}
            >
              {t("projects.export.columnsEssentials")}
            </AppButton>
            <AppButton
              variant="secondary"
              className="w-fit!"
              disabled={loading}
              onClick={onClearColumns}
            >
              {t("projects.export.columnsNone")}
            </AppButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PROJECT_EXPORT_COLUMN_GROUPS.map((group) => (
            <div
              key={group.id}
              className="rounded-xl border border-(--Grey300) bg-(--app-surface) p-3"
            >
              <p className="m-0 mb-2 text-xs font-bold uppercase tracking-wide text-(--Grey600)">
                {t(`projects.export.columnGroups.${group.id}`)}
              </p>
              <div className="flex flex-col gap-1.5">
                {group.columns.map((column) => (
                  <AppCheckBox
                    key={column}
                    checked={columns.includes(column)}
                    disabled={loading}
                    onChange={() => onToggleColumn(column)}
                  >
                    {t(`projects.export.columnLabels.${column}`)}
                  </AppCheckBox>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" disabled={loading} onClick={onClose}>
          {t("projects.export.cancel")}
        </AppButton>
        <AppButton loading={loading} onClick={onSubmit}>
          {t("projects.export.submit")}
        </AppButton>
      </div>
    </AppDialog>
  );
};

export default ProjectExportDialog;
