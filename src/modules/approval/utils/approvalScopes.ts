import {
  ApprovalActionScope,
  type TApprovalActionScope,
} from "../types";

export const APPROVAL_ACTION_SCOPES: {
  value: TApprovalActionScope;
  labelKey:
    | "approval.scopes.create"
    | "approval.scopes.update"
    | "approval.scopes.delete"
    | "approval.scopes.all";
}[] = [
  { value: ApprovalActionScope.Create, labelKey: "approval.scopes.create" },
  { value: ApprovalActionScope.Update, labelKey: "approval.scopes.update" },
  { value: ApprovalActionScope.Delete, labelKey: "approval.scopes.delete" },
  { value: ApprovalActionScope.All, labelKey: "approval.scopes.all" },
];

export const ACTION_TYPE_LABEL_KEYS = [
  "approval.scopes.create",
  "approval.scopes.update",
  "approval.scopes.delete",
] as const;
