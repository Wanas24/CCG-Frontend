import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useProjectOverviewManager } from "../hooks/useProjectOverviewManager";
import type { TProject } from "../types/project";
import ProjectFormFields from "./ProjectFormFields";

type Props = {
  project: TProject;
};

const ProjectOverviewPanel = ({ project }: Props) => {
  const { t } = useTranslation();
  const manager = useProjectOverviewManager(project);
  const fieldsDisabled = !manager.canEdit || !manager.editing || manager.isSaving;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="m-0 text-base font-semibold text-(--app-text)">
            {t("projects.workspace.sections.overview")}
          </h2>
          <p className={`m-0 mt-1 text-sm ${DesignTokens.typography.muted}`}>
            {manager.canEdit
              ? manager.editing
                ? t("projects.form.editSubtitle")
                : t("projects.form.readOnlyHint")
              : t("projects.form.readOnlyNoPermission")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {manager.canEdit && !manager.editing ? (
            <AppButton className="w-fit!" onClick={manager.startEdit}>
              {t("projects.form.edit")}
            </AppButton>
          ) : null}
          {manager.canEdit && manager.editing ? (
            <>
              <AppButton
                variant="secondary"
                className="w-fit!"
                disabled={manager.isSaving}
                onClick={manager.cancelEdit}
              >
                {t("projects.form.cancel")}
              </AppButton>
              <AppButton
                htmlType="submit"
                form="project-overview-form"
                className="w-fit!"
                loading={manager.isSaving}
              >
                {t("projects.form.save")}
              </AppButton>
            </>
          ) : null}
        </div>
      </div>

      <form
        id="project-overview-form"
        onSubmit={manager.submitUpdate}
        noValidate
      >
        <ProjectFormFields
          control={manager.form.control}
          disabled={fieldsDisabled}
          selectedClientLabel={manager.clientLabel}
          onClientLabelChange={manager.setClientLabel}
          showIsActive
        />
      </form>
    </div>
  );
};

export default ProjectOverviewPanel;
