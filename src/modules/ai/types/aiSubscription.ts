export type TAiSubscriptionUpdateRequest = {
  isSubscribed: boolean;
  subscribedFromUtc?: string | null;
  subscribedToUtc?: string | null;
  hasUnlimitedUsage: boolean;
  monthlyTokenLimit: number;
  monthlyMessageLimit: number;
  historyMessageCount: number;
};

export type TAiCompanyUserSubscriptionResponse = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isFired: boolean;
  isManager: boolean;
  hasSubscription: boolean;
  isSubscribed: boolean;
  subscribedFromUtc?: string | null;
  subscribedToUtc?: string | null;
  hasUnlimitedUsage: boolean;
  monthlyTokenLimit: number;
  monthlyMessageLimit: number;
  historyMessageCount: number;
  usedTokens?: number;
  usedMessages?: number;
  remainingTokens?: number | null;
  remainingMessages?: number | null;
};

export type TGetAiSubscriptionsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isManager?: boolean;
  isFired?: boolean;
  isActive?: boolean;
};
