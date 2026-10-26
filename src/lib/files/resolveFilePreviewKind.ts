export type FilePreviewKind = "image" | "pdf" | "unsupported";

const IMAGE_EXTENSION = /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i;
const PDF_EXTENSION = /\.pdf$/i;

export const resolveFilePreviewKind = ({
  mimeType,
  fileName,
}: {
  mimeType?: string | null;
  fileName?: string | null;
}): FilePreviewKind => {
  const mime = (mimeType ?? "").trim().toLowerCase();

  if (mime === "application/pdf" || mime === "application/x-pdf") {
    return "pdf";
  }
  if (mime.startsWith("image/")) {
    return "image";
  }

  const name = (fileName ?? "").trim();
  if (PDF_EXTENSION.test(name)) return "pdf";
  if (IMAGE_EXTENSION.test(name)) return "image";
  return "unsupported";
};
