import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n/useLocale";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { PROJECTS_ROUTES } from "../routes/paths";
import type { TProject } from "../types/project";
import {
  projectApprovalLabelKey,
  projectStatusLabelKey,
} from "../utils/projectLabels";

type Props = {
  project: TProject;
  canDelete?: boolean;
  onDelete?: () => void;
};

const tagClass =
  "rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[10px] font-bold text-(--Grey600)";

const ProjectWorkspaceHeader = ({
  project,
  canDelete = false,
  onDelete,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRtl } = useLocale();
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const statusKey = projectStatusLabelKey(project.status);
  const approvalKey = projectApprovalLabelKey(project.approvalStatus);

  return (
    <header className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <AppButton
          variant="secondary"
          icon={<BackArrow size={16} />}
          className="w-fit!"
          onClick={() => navigate(PROJECTS_ROUTES.root)}
        >
          {t("projects.workspace.back")}
        </AppButton>
        {canDelete ? (
          <AppButton
            variant="delete"
            className="w-fit!"
            onClick={onDelete}
          >
            {t("projects.form.delete")}
          </AppButton>
        ) : null}
      </div>

      <div className="min-w-0">
        <h1
          className={clsx(
            "m-0 text-2xl font-semibold",
            DesignTokens.typography.headingSm,
          )}
          dir="auto"
        >
          {project.name || t("projects.title")}
        </h1>
        <p className={clsx("m-0 mt-1 text-sm", DesignTokens.typography.muted)}>
          <span dir="auto">{project.number || t("projects.noNumber")}</span>
          {" · "}
          <span dir="auto">{project.clientName || t("projects.noClient")}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {statusKey ? <span className={tagClass}>{t(statusKey)}</span> : null}
          {approvalKey ? (
            <span className={tagClass}>{t(approvalKey)}</span>
          ) : null}
          <span
            className={clsx(
              tagClass,
              project.isActive
                ? "border-(--statusG200) text-(--statusG200)"
                : undefined,
            )}
          >
            {project.isActive
              ? t("projects.active.yes")
              : t("projects.active.no")}
          </span>
        </div>
      </div>
    </header>
  );
};

export default ProjectWorkspaceHeader;
