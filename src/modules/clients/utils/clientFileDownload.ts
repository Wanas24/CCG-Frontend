import { triggerAnchorDownload } from "@/lib/files/triggerAnchorDownload";

const apiBaseUrl = () =>
  String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export const resolveClientFileUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const base = apiBaseUrl();
  if (!base) return trimmed;
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  return `${base}/${trimmed}`;
};

const saveBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  try {
    triggerAnchorDownload(objectUrl, fileName || "download");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const downloadClientFileFromUrl = async (
  url: string,
  fileName: string,
) => {
  const resolved = resolveClientFileUrl(url);
  if (!resolved) {
    throw new Error("Missing download URL");
  }

  try {
    const response = await fetch(resolved);
    if (!response.ok) {
      throw new Error("Failed to download file");
    }
    const blob = await response.blob();
    saveBlob(blob, fileName || "download");
  } catch {
    triggerAnchorDownload(resolved, fileName || "download");
  }
};

export const formatClientFileSize = (bytes?: number | null) => {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
