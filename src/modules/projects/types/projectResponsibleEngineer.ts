import type { TSimpleResult } from "@/modules/authentication/types";
import type {
  TEngineerApprovalDecision,
  TEngineerPosition,
} from "../constants/engineerPositions";

export type TProjectResponsibleEngineer = {
  id: number;
  projectId?: number | null;
  employeeId?: string | null;
  employeeName: string;
  position: TEngineerPosition | number;
  approvalStatus?: number | null;
  approvalStatusName?: string | null;
  canApprove?: boolean | null;
};

export type TCreateProjectResponsibleEngineerRequest = {
  projectId: number;
  employeeId?: string | null;
  employeeName: string;
  position: number;
};

export type TUpdateProjectResponsibleEngineerRequest =
  TCreateProjectResponsibleEngineerRequest & {
    id: number;
  };

export type TDecideProjectResponsibleEngineerRequest = {
  id: number;
  decision: TEngineerApprovalDecision;
  comment?: string;
};

export type TGetProjectResponsibleEngineersResponse = TSimpleResult<
  TProjectResponsibleEngineer[]
>;

export type TCreateProjectResponsibleEngineerResponse = TSimpleResult;

export type TUpdateProjectResponsibleEngineerResponse = TSimpleResult;

export type TDeleteProjectResponsibleEngineerResponse = TSimpleResult;

export type TDecideProjectResponsibleEngineerResponse = TSimpleResult;
