import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getSimpleResultFromAxiosError } from "@/lib/api/applyApiFieldErrors";
import { VALIDATION } from "@/shared/validation";
import { useDeleteReportLayoutImage } from "../api/hooks/useDeleteReportLayoutImage";
import { useGetReportLayoutImages } from "../api/hooks/useGetReportLayoutImages";
import { useUploadReportLayoutImage } from "../api/hooks/useUploadReportLayoutImage";
import { createSignatureImageFileSchema } from "../schemas/signatureImageSchema";
import type { TReportLayoutImage } from "../types";

const readUploadIssues = (data: unknown): string[] => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return [];
  return Object.values(data).flatMap((value) => {
    if (typeof value === "string" && value.trim()) return [value];
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0,
    );
  });
};

const uploadedImage = (data: TReportLayoutImage | TReportLayoutImage[] | null | undefined) => {
  if (Array.isArray(data)) {
    return data.find((image) => image.url.trim()) ?? null;
  }
  if (data && typeof data === "object" && "url" in data && data.url.trim()) {
    return data;
  }
  return null;
};

const MAX_SIGNATURE_IMAGE_BYTES = 5 * 1024 * 1024;

export const useReportLayoutSignatureImage = (libraryOpen: boolean) => {
  const { t } = useTranslation();
  const [uploadIssues, setUploadIssues] = useState<string[]>([]);
  const uploadMutation = useUploadReportLayoutImage();
  const deleteMutation = useDeleteReportLayoutImage();
  const imagesQuery = useGetReportLayoutImages(libraryOpen);

  const showIssues = (issues: string[]) => {
    setUploadIssues(issues);
    return null;
  };

  const upload = async (file: File) => {
    setUploadIssues([]);

    const parsed = createSignatureImageFileSchema(t).safeParse(file);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? t("reportLayout.signature.invalidType");
      return showIssues([message]);
    }

    if (file.size > MAX_SIGNATURE_IMAGE_BYTES) {
      return showIssues([t(VALIDATION.imageMaxSize)]);
    }

    try {
      const result = await uploadMutation.mutateAsync(file);
      if (!result.isSuccess) {
        const issues = readUploadIssues(result.data);
        return showIssues(issues.length > 0 ? issues : [result.message].filter(Boolean));
      }

      const uploaded = uploadedImage(result.data);
      if (!uploaded?.url) {
        return showIssues([t("reportLayout.signature.uploadEmpty")]);
      }

      setUploadIssues([]);
      return uploaded.url;
    } catch (error) {
      const result = getSimpleResultFromAxiosError(error);
      const issues = readUploadIssues(result?.data);
      return showIssues(
        issues.length > 0 ? issues : [result?.message ?? ""].filter(Boolean),
      );
    }
  };

  const remove = async (fileId: number) => {
    try {
      const result = await deleteMutation.mutateAsync(fileId);
      return result.isSuccess;
    } catch {
      return false;
    }
  };

  return {
    upload,
    remove,
    uploadIssues,
    isUploading: uploadMutation.isPending,
    deletingFileId: deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
    isLoadingImages: imagesQuery.isLoading,
    images:
      imagesQuery.data?.isSuccess && Array.isArray(imagesQuery.data.data)
        ? imagesQuery.data.data
        : [],
  };
};
