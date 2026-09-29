export type TAiUiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isPending?: boolean;
  isError?: boolean;
};
