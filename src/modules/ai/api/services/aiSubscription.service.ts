import { callEndpoint } from "@/lib/api/callEndpoint";
import { aiSubscriptionEndpoints } from "../endPoints/aiSubscription.endpoints";
import type {
  TAiSubscriptionUpdateRequest,
  TGetAiSubscriptionResponse,
  TGetAiSubscriptionsParams,
  TGetAiSubscriptionsResponse,
  TUpdateAiSubscriptionResponse,
} from "../../types";

const DEFAULT_SUBSCRIPTIONS_PAGE_SIZE = 20;
const MAX_SUBSCRIPTIONS_PAGE_SIZE = 100;

const toQueryParams = (params: TGetAiSubscriptionsParams = {}) => {
  const page = params.page ?? 1;
  const pageSize = Math.min(
    params.pageSize ?? DEFAULT_SUBSCRIPTIONS_PAGE_SIZE,
    MAX_SUBSCRIPTIONS_PAGE_SIZE,
  );

  return {
    page,
    pageSize,
    ...(params.search ? { search: params.search } : {}),
    ...(params.isManager !== undefined ? { isManager: params.isManager } : {}),
    ...(params.isFired !== undefined ? { isFired: params.isFired } : {}),
    ...(params.isActive !== undefined ? { isActive: params.isActive } : {}),
  };
};

export const aiSubscriptionService = {
  getAiSubscriptions: (params?: TGetAiSubscriptionsParams) =>
    callEndpoint<TGetAiSubscriptionsResponse>(aiSubscriptionEndpoints.list, {
      queryParams: toQueryParams(params),
    }),

  getAiSubscription: (userId: string) =>
    callEndpoint<TGetAiSubscriptionResponse>(aiSubscriptionEndpoints.get, {
      pathParams: { userId },
    }),

  updateAiSubscription: (
    userId: string,
    body: TAiSubscriptionUpdateRequest,
  ) =>
    callEndpoint<
      TUpdateAiSubscriptionResponse,
      TAiSubscriptionUpdateRequest
    >(aiSubscriptionEndpoints.update, {
      pathParams: { userId },
      body,
    }),
};
