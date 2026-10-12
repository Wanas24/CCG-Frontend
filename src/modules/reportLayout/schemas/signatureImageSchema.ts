import type { TFunction } from "i18next";
import { z } from "zod";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp"]);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/x-ms-bmp",
]);

const extensionOf = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  return fileName.includes(".") ? extension : "";
};

export const createSignatureImageFileSchema = (t: TFunction) =>
  z.file().refine((file) => {
    if (!ALLOWED_EXTENSIONS.has(extensionOf(file.name))) return false;
    if (!file.type) return true;
    return ALLOWED_MIME_TYPES.has(file.type);
  }, t("reportLayout.signature.invalidType"));
