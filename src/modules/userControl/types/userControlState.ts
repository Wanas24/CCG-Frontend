import type { TApplicationRole } from "./applicationRole";

export type UserControlDrawerState = {
  roleId: string;
  tab: "perms" | "members";
  query: string;
  draft: Set<number>;
  touched: boolean;
};

export type ConfirmState =
  | { kind: "delete"; role: TApplicationRole }
  | { kind: "discard" }
  | null;
