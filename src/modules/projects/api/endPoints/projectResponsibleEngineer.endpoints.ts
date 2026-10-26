import { createEndpoint } from "@/lib/api/createEndpoint";

export const projectResponsibleEngineerEndpoints = {
  byProject: createEndpoint({
    method: "GET",
    path: `/ProjectResponsibleEngineer/by-project/:projectId`,
    auth: "required",
    skipToast: true,
  }),
  create: createEndpoint({
    method: "POST",
    path: `/ProjectResponsibleEngineer`,
    auth: "required",
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/ProjectResponsibleEngineer`,
    auth: "required",
  }),
  delete: createEndpoint({
    method: "DELETE",
    path: `/ProjectResponsibleEngineer/:id`,
    auth: "required",
  }),
  decide: createEndpoint({
    method: "POST",
    path: `/ProjectResponsibleEngineer/:id/approval`,
    auth: "required",
  }),
};
