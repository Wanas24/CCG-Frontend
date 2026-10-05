import type { TSimpleResult } from "@/modules/authentication/types";
import type {
  TApprovalEntityType,
  TApprovalPendingRequest,
  TApprovalWorkflow,
  TApprovalWorkflowCommand,
} from "./approvalWorkflow";

export type {
  TApprovalActionScope,
  TApprovalApproverGroup,
  TApprovalApproverGroupCommand,
  TApprovalApproverType,
  TApprovalDecision,
  TApprovalEntityType,
  TApprovalLevel,
  TApprovalLevelCommand,
  TApprovalPendingRequest,
  TApprovalRequirementMode,
  TApprovalRequestGroupStatus,
  TApprovalRequestLevelStatus,
  TApprovalWorkflow,
  TApprovalWorkflowCommand,
} from "./approvalWorkflow";

export {
  ApprovalActionScope,
  ApprovalApproverType,
  ApprovalDecision,
  ApprovalRequirementMode,
} from "./approvalWorkflow";

export type TApprovalPagedResult<T> = {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type TGetApprovalEntityTypesResponse = TSimpleResult<
  TApprovalEntityType[]
>;

export type TGetApprovalWorkflowsResponse = TSimpleResult<TApprovalWorkflow[]>;

export type TGetPendingApprovalRequestsResponse = TSimpleResult<
  TApprovalPagedResult<TApprovalPendingRequest>
>;

export type TSaveApprovalWorkflowResponse = TSimpleResult<TApprovalWorkflow>;

export type TDeactivateApprovalWorkflowResponse = TSimpleResult;

export type TForceDecideApprovalRequestResponse = TSimpleResult;

export type TSaveApprovalWorkflowBody = TApprovalWorkflowCommand;
