import { resolveAbsoluteFileUrl } from "./resolveAbsoluteFileUrl";

export type FetchedFileObjectUrl = {
  objectUrl: string;
  mimeType: string;
};

export const fetchFileAsObjectUrl = async (
  url: string,
  signal?: AbortSignal,
): Promise<FetchedFileObjectUrl> => {
  const resolved = resolveAbsoluteFileUrl(url);
  if (!resolved) {
    throw new Error("Missing file URL");
  }

  const response = await fetch(resolved, { signal });
  if (!response.ok) {
    throw new Error("Failed to fetch file");
  }

  const blob = await response.blob();
  return {
    objectUrl: URL.createObjectURL(blob),
    mimeType: blob.type || "",
  };
};
