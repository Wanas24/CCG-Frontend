import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const projectsMenuPermissions = [PermissionsList.Project.Get] as const;

type ProjectsAccessInput = {
  granted: ReadonlySet<string>;
};

export const canAccessProjects = ({ granted }: ProjectsAccessInput) =>
  granted.has(PermissionsList.Project.Get);
