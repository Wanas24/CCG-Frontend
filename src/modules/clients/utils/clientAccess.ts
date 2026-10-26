import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const clientsMenuPermissions = [PermissionsList.Client.Get] as const;

type ClientsAccessInput = {
  granted: ReadonlySet<string>;
};

export const canAccessClients = ({ granted }: ClientsAccessInput) =>
  granted.has(PermissionsList.Client.Get);
