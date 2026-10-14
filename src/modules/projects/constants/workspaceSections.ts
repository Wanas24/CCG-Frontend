export const PROJECT_WORKSPACE_SECTIONS = [
  "overview",
  "responsible-engineers",
  "team",
  "files",
  "alerts",
  "approvals",
  "boq",
  "invoices",
  "items",
  "contracts",
] as const;

export type TProjectWorkspaceSection =
  (typeof PROJECT_WORKSPACE_SECTIONS)[number];

export const PROJECT_WORKSPACE_DEFAULT_SECTION: TProjectWorkspaceSection =
  "overview";

export const PROJECT_WORKSPACE_READY_SECTIONS = [
  "overview",
  "responsible-engineers",
  "team",
  "files",
  "alerts",
  "approvals",
] as const satisfies readonly TProjectWorkspaceSection[];

export const isProjectWorkspaceSection = (
  value: string | undefined,
): value is TProjectWorkspaceSection =>
  PROJECT_WORKSPACE_SECTIONS.includes(value as TProjectWorkspaceSection);

export const isProjectWorkspaceReadySection = (
  section: TProjectWorkspaceSection,
) =>
  (PROJECT_WORKSPACE_READY_SECTIONS as readonly string[]).includes(section);
