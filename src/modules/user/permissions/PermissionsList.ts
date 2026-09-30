export const PermissionsList = {} as const;

export type AppPermission =
  (typeof PermissionsList)[keyof typeof PermissionsList];
