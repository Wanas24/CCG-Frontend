import type { TApplicationRole } from "./applicationRole";

export type InviteStepStatus = "wait" | "run" | "ok" | "fail" | "warn" | "skip";

export type InviteRunState = {
  title: string;
  subtitle: string;
  closable: boolean;
  steps: { title: string; detail: string; status: InviteStepStatus }[];
};

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
