import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import type { TProject } from "../types/project";
import {
  projectApprovalLabelKey,
  projectSiteLine,
  projectStatusLabelKey,
  projectTypeLabelKey,
} from "../utils/projectLabels";

type Props = {
  project: TProject;
};

const tagClass =
  "rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[10px] font-bold text-(--Grey600)";

const ProjectCard = ({ project }: Props) => {
  const { t } = useTranslation();
  const statusKey = projectStatusLabelKey(project.status);
  const approvalKey = projectApprovalLabelKey(project.approvalStatus);
  const typeKey = projectTypeLabelKey(project.projectType);
  const site = projectSiteLine(project);
  const approvalTone =
    project.approvalStatus === 2
      ? "border-(--statusG200) text-(--statusG200)"
      : project.approvalStatus === 1
        ? "border-(--statusY200) text-(--statusY200)"
        : "border-(--statusR200) text-(--statusR200)";

  return (
    <article className="flex min-h-44 min-w-0 flex-col gap-3 rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4 text-start transition hover:border-(--Grey400)">
      <div className="min-w-0">
        <h3
          className={clsx(
            "m-0 truncate text-base font-semibold",
            DesignTokens.typography.headingSm,
          )}
          dir="auto"
        >
          {project.name || t("projects.title")}
        </h3>
        <p className={clsx("m-0 mt-1 text-xs", DesignTokens.typography.muted)}>
          <span dir="auto">{project.number || t("projects.noNumber")}</span>
          {" · "}
          <span dir="auto">{project.clientName || t("projects.noClient")}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className={tagClass}>
          {statusKey ? t(statusKey) : t("projects.filters.anyStatus")}
        </span>
        <span className={clsx(tagClass, approvalTone)}>
          {approvalKey ? t(approvalKey) : t("projects.filters.anyApproval")}
        </span>
        <span className={tagClass}>
          {typeKey ? t(typeKey) : t("projects.filters.anyType")}
        </span>
        <span
          className={clsx(
            tagClass,
            project.isActive
              ? "border-(--statusG200) text-(--statusG200)"
              : undefined,
          )}
        >
          {project.isActive ? t("projects.active.yes") : t("projects.active.no")}
        </span>
      </div>

      <p
        className={clsx(
          "mt-auto mb-0 text-xs",
          DesignTokens.typography.muted,
        )}
        dir="auto"
      >
        {site || t("projects.noSite")}
      </p>
    </article>
  );
};

export default ProjectCard;
