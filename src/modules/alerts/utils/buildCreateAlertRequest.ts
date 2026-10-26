import type {
  TAlertAudienceMode,
  TAlertEntityContext,
  TCreateAlertRequest,
} from "../types";

type BuildCreateAlertRequestInput = {
  message: string;
  triggerAt: string;
  audience: TAlertAudienceMode;
  receiverUserIds: string[];
  entityContext?: TAlertEntityContext;
};

export const buildCreateAlertRequest = ({
  message,
  triggerAt,
  audience,
  receiverUserIds,
  entityContext,
}: BuildCreateAlertRequestInput): TCreateAlertRequest => {
  const everyone = audience === "everyone";

  const body: TCreateAlertRequest = {
    message: message.trim(),
    triggerAt,
    assignToAllEmployees: everyone,
    assignToManagers: audience === "managers",
    receiverUserIds: everyone ? [] : receiverUserIds,
  };

  if (entityContext?.projectId !== undefined) {
    body.projectId = entityContext.projectId;
  }

  if (entityContext?.entityId !== undefined) {
    body.entityId = entityContext.entityId;
  }

  if (
    entityContext?.entityType !== undefined &&
    entityContext.entityType !== ""
  ) {
    body.entityType = entityContext.entityType;
  }

  return body;
};
