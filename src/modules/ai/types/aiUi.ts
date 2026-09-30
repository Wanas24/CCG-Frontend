import type { TAiAssistantArtifact, TAiAssistantSource } from "./ai";

export type TAiAssistantUiMeta = {
  usedTools?: string[];
  selectedToolGroups?: string[];
  warnings?: string[];
  sources?: TAiAssistantSource[];
  artifacts?: TAiAssistantArtifact[];
  transcript?: string;
};

export type TAiUiLocalAttachment = {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  file: File;
};

export type TAiUiLocalAudio = {
  fileName: string;
  contentType: string;
  size: number;
  file: File;
};

export type TAiUiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isPending?: boolean;
  isError?: boolean;
  localAttachments?: TAiUiLocalAttachment[];
  localAudio?: TAiUiLocalAudio | null;
} & TAiAssistantUiMeta;

export type TAiComposerSendPayload = {
  message: string;
  audio?: File | null;
  attachments?: File[];
};
