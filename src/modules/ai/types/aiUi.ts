import type { TAiAssistantArtifact, TAiAssistantSource } from "./ai";

export type TAiAssistantUiMeta = {
  usedTools?: string[];
  selectedToolGroups?: string[];
  warnings?: string[];
  sources?: TAiAssistantSource[];
  artifacts?: TAiAssistantArtifact[];
};

export type TAiUiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isPending?: boolean;
  isError?: boolean;
} & TAiAssistantUiMeta;
