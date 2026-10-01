export type TAiTokenUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

export type TAiQuotaSnapshot = {
  hasUnlimitedUsage: boolean;
  monthlyTokenLimit: number;
  monthlyMessageLimit: number;
  usedTokens: number;
  usedMessages: number;
  remainingTokens?: number | null;
  remainingMessages?: number | null;
  usagePeriodStartedAtUtc: string;
};

export type TAiAssistantSource = {
  type: string;
  id: string;
  label?: string;
};

export type TAiAssistantArtifact = {
  fileName: string;
  contentType: string;
  contentBase64?: string;
  url?: string;
};

export type TAiAssistantResponse = {
  chatId: string;
  answer: string;
  selectedToolGroups: string[];
  usedTools: string[];
  warnings: string[];
  sources: TAiAssistantSource[];
  usage: TAiTokenUsage;
  routerUsage: TAiTokenUsage;
  quota?: TAiQuotaSnapshot;
  artifacts: TAiAssistantArtifact[];
  transcript?: string;
  transcriptionUsage?: TAiTokenUsage;
  audioDurationMinutes?: number;
  tokensPerAudioSecond?: number;
};

export type TAiChatSummary = {
  id: string;
  title: string;
  isArchived: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
};

export type TAiMessageResponse = {
  id: number;
  role: string;
  content: string;
  totalTokens: number;
  transcriptionTotalTokens: number;
  audioDurationMinutes?: number | null;
  tokensPerAudioSecond?: number | null;
  createdAtUtc: string;
};

export type TAiUsageStatusResponse = {
  isSubscribed: boolean;
  subscribedFromUtc?: string | null;
  subscribedToUtc?: string | null;
  historyMessageCount: number;
  currentPeriod?: TAiQuotaSnapshot | null;
};

export type TSendAiChatRequest = {
  message?: string;
  audio?: File | null;
  attachments?: File[];
  chatId?: string | null;
};
