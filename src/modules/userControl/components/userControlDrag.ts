export type UserControlDragPayload =
  | { type: "role"; id: string }
  | { type: "user"; id: string }
  | { type: "perm"; id: number }
  | { type: "group"; id: string }
  | { type: "rolechip"; userId: string; roleId: string };

export type UserControlDropTarget =
  | { target: "employee"; userId: string }
  | { target: "role"; roleId: string; isShared: boolean }
  | { target: "unassign" };

const dragTypes = new Set(["role", "user", "perm", "group", "rolechip"]);
const dropTargets = new Set(["employee", "role", "unassign"]);

export const isUserControlDragPayload = (value: unknown): value is UserControlDragPayload => {
  if (!value || typeof value !== "object" || !("type" in value)) return false;
  return dragTypes.has(String((value as { type: unknown }).type));
};

export const isUserControlDropTarget = (value: unknown): value is UserControlDropTarget => {
  if (!value || typeof value !== "object" || !("target" in value)) return false;
  return dropTargets.has(String((value as { target: unknown }).target));
};
