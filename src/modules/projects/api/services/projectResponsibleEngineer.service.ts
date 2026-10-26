import { callEndpoint } from "@/lib/api/callEndpoint";
import { projectResponsibleEngineerEndpoints } from "../endPoints/projectResponsibleEngineer.endpoints";
import type {
  TCreateProjectResponsibleEngineerRequest,
  TCreateProjectResponsibleEngineerResponse,
  TDecideProjectResponsibleEngineerRequest,
  TDecideProjectResponsibleEngineerResponse,
  TDeleteProjectResponsibleEngineerResponse,
  TGetProjectResponsibleEngineersResponse,
  TUpdateProjectResponsibleEngineerRequest,
  TUpdateProjectResponsibleEngineerResponse,
} from "../../types/projectResponsibleEngineer";

export const projectResponsibleEngineerService = {
  byProject: (projectId: number) =>
    callEndpoint<TGetProjectResponsibleEngineersResponse>(
      projectResponsibleEngineerEndpoints.byProject,
      { pathParams: { projectId } },
    ),

  create: (body: TCreateProjectResponsibleEngineerRequest) =>
    callEndpoint<
      TCreateProjectResponsibleEngineerResponse,
      TCreateProjectResponsibleEngineerRequest
    >(projectResponsibleEngineerEndpoints.create, { body }),

  update: (body: TUpdateProjectResponsibleEngineerRequest) =>
    callEndpoint<
      TUpdateProjectResponsibleEngineerResponse,
      TUpdateProjectResponsibleEngineerRequest
    >(projectResponsibleEngineerEndpoints.update, { body }),

  delete: (id: number) =>
    callEndpoint<TDeleteProjectResponsibleEngineerResponse>(
      projectResponsibleEngineerEndpoints.delete,
      { pathParams: { id } },
    ),

  decide: ({
    id,
    decision,
    comment,
  }: TDecideProjectResponsibleEngineerRequest) =>
    callEndpoint<TDecideProjectResponsibleEngineerResponse, Record<string, never>>(
      projectResponsibleEngineerEndpoints.decide,
      {
        pathParams: { id },
        queryParams: {
          decision,
          ...(comment?.trim() ? { comment: comment.trim() } : {}),
        },
        body: {},
      },
    ),
};
