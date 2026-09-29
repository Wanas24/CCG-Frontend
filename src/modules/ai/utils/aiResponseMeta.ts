export const dedupeAiLabels = (values: string[] | undefined): string[] => {
  if (!values?.length) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    result.push(trimmed);
  }

  return result;
};

export const createAiAssistantMetaKey = (chatId: string, content: string) =>
  `${chatId}::${content}`;
