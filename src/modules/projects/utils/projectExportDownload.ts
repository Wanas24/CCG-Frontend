import { triggerAnchorDownload } from "@/lib/files/triggerAnchorDownload";
import {
  PROJECT_EXPORT_EXTENSION,
  type TProjectExportFormat,
} from "../constants/projectExport";

export const fileNameFromContentDisposition = (
  header: string | undefined,
  fallback: string,
) => {
  if (!header) return fallback;

  const utf8Match = /filename\*=(?:UTF-8''|utf-8'')([^;]+)/i.exec(header);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].replace(/"/g, "").trim());
    } catch {
      return utf8Match[1].replace(/"/g, "").trim();
    }
  }

  const plainMatch = /filename="?([^";]+)"?/i.exec(header);
  if (plainMatch?.[1]) {
    try {
      return decodeURIComponent(plainMatch[1].trim());
    } catch {
      return plainMatch[1].trim();
    }
  }

  return fallback;
};

export const defaultProjectExportFileName = (
  format: TProjectExportFormat,
  title?: string,
) => {
  const stem =
    title?.trim().replace(/[<>:"/\\|?*]+/g, "-").replace(/\s+/g, "-") ||
    "projects-export";
  return `${stem}.${PROJECT_EXPORT_EXTENSION[format]}`;
};

export const downloadProjectExportBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  try {
    triggerAnchorDownload(objectUrl, fileName);
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
  }
};
