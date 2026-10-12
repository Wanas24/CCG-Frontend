import clsx from "clsx";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import {
  PROJECT_WORKSPACE_SECTIONS,
  isProjectWorkspaceReadySection,
  type TProjectWorkspaceSection,
} from "../constants/workspaceSections";
import { projectWorkspacePath } from "../routes/paths";

type Props = {
  projectId: number;
};

const sectionLabelKey = (section: TProjectWorkspaceSection) =>
  `projects.workspace.sections.${section}` as const;

const ProjectWorkspaceNav = ({ projectId }: Props) => {
  const { t } = useTranslation();

  return (
    <nav
      className="flex gap-1 overflow-x-auto rounded-2xl border border-(--Grey300) bg-(--app-surface) p-1.5 lg:flex-col lg:overflow-visible"
      aria-label={t("projects.workspace.navLabel")}
    >
      {PROJECT_WORKSPACE_SECTIONS.map((section) => {
        const ready = isProjectWorkspaceReadySection(section);
        return (
          <NavLink
            key={section}
            to={projectWorkspacePath(projectId, section)}
            className={({ isActive }) =>
              clsx(
                "inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-(--Primary100) text-(--Primary400)"
                  : "text-(--Grey600) hover:bg-(--Grey100) hover:text-(--app-text)",
              )
            }
          >
            <span>{t(sectionLabelKey(section))}</span>
            {!ready ? (
              <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-1.5 py-0.5 text-[10px] font-bold text-(--Grey500)">
                {t("projects.workspace.soon")}
              </span>
            ) : null}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default ProjectWorkspaceNav;
