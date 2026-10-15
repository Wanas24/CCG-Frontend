export const CLIENT_WORKSPACE_SECTIONS = [
  "overview",
  "files",
  "alerts",
] as const;

export type TClientWorkspaceSection =
  (typeof CLIENT_WORKSPACE_SECTIONS)[number];

export const CLIENT_WORKSPACE_DEFAULT_SECTION: TClientWorkspaceSection =
  "overview";

export const CLIENT_WORKSPACE_READY_SECTIONS = [
  "overview",
  "files",
  "alerts",
] as const satisfies readonly TClientWorkspaceSection[];

export const isClientWorkspaceSection = (
  value: string | undefined,
): value is TClientWorkspaceSection =>
  CLIENT_WORKSPACE_SECTIONS.includes(value as TClientWorkspaceSection);

export const isClientWorkspaceReadySection = (
  section: TClientWorkspaceSection,
) =>
  (CLIENT_WORKSPACE_READY_SECTIONS as readonly string[]).includes(section);
