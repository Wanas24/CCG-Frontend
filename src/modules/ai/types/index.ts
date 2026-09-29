import type { TSimpleResult } from "@/modules/authentication/types";
import type { TPagedResult } from "@/lib/api/pagedResult";
import type {
  TAiAssistantResponse,
  TAiChatSummary,
  TAiMessageResponse,
  TAiUsageStatusResponse,
} from "./ai";
import type { TAiCompanyUserSubscriptionResponse } from "./aiSubscription";
import type { TAiPagedResult } from "./aiPagedResult";

export type {
  TAiAssistantArtifact,
  TAiAssistantResponse,
  TAiAssistantSource,
  TAiChatSummary,
  TAiMessageResponse,
  TAiQuotaSnapshot,
  TAiTokenUsage,
  TAiUsageStatusResponse,
  TSendAiChatRequest,
} from "./ai";

export type {
  TAiCompanyUserSubscriptionResponse,
  TAiSubscriptionUpdateRequest,
  TGetAiSubscriptionsParams,
} from "./aiSubscription";

export type { TAiPagedResult } from "./aiPagedResult";

export type { TAiUiMessage, TAiAssistantUiMeta } from "./aiUi";

export type { TPagedResult };

export type TSendAiChatResponse = TSimpleResult<TAiAssistantResponse>;

export type TGetAiChatsResponse = TSimpleResult<TAiChatSummary[]>;

export type TGetAiMessagesResponse = TSimpleResult<
  TAiPagedResult<TAiMessageResponse>
>;

export type TArchiveAiChatResponse = TSimpleResult;

export type TGetAiUsageResponse = TSimpleResult<TAiUsageStatusResponse>;

export type TGetAiSubscriptionsResponse = TSimpleResult<
  TPagedResult<TAiCompanyUserSubscriptionResponse>
>;

export type TGetAiSubscriptionResponse =
  TSimpleResult<TAiCompanyUserSubscriptionResponse>;

export type TUpdateAiSubscriptionResponse =
  TSimpleResult<TAiCompanyUserSubscriptionResponse>;

