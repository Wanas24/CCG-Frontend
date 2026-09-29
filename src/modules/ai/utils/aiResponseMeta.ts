import type { TAiAssistantSource } from "../types";

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

export const getAiSourceIdentity = (source: TAiAssistantSource) =>
  `${source.type}::${source.id}::${source.label ?? ""}`;

export const dedupeAiSources = (
  sources: TAiAssistantSource[] | undefined,
): TAiAssistantSource[] => {
  if (!sources?.length) {
    return [];
  }

  const seen = new Set<string>();
  const result: TAiAssistantSource[] = [];

  for (const source of sources) {
    const identity = getAiSourceIdentity(source);
    if (seen.has(identity)) {
      continue;
    }

    seen.add(identity);
    result.push(source);
  }

  return result;
};

const ALLOWED_ARTIFACT_URL_PROTOCOLS = new Set(["http:", "https:"]);

export const sanitizeAiArtifactUrl = (url: string | undefined): string | null => {
  if (!url?.trim()) {
    return null;
  }

  try {
    const parsed = new URL(url.trim(), "https://example.invalid");
    if (!ALLOWED_ARTIFACT_URL_PROTOCOLS.has(parsed.protocol)) {
      return null;
    }

    if (parsed.origin === "https://example.invalid") {
      return null;
    }

    return url.trim();
  } catch {
    return null;
  }
};

export const createBlobFromBase64 = (
  contentBase64: string,
  contentType: string,
): Blob | null => {
  try {
    const commaIndex = contentBase64.indexOf(",");
    const payload =
      commaIndex >= 0 ? contentBase64.slice(commaIndex + 1) : contentBase64;
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], {
      type: contentType || "application/octet-stream",
    });
  } catch {
    return null;
  }
};
