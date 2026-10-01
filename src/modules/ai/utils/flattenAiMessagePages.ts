import type { TAiMessageResponse, TGetAiMessagesResponse } from "../types";

export const flattenAiMessagePages = (
  pages: TGetAiMessagesResponse[] | undefined,
): TAiMessageResponse[] => {
  if (!pages?.length) {
    return [];
  }

  return [...pages]
    .reverse()
    .flatMap((page) =>
      page.isSuccess && page.data ? page.data.data : [],
    );
};
