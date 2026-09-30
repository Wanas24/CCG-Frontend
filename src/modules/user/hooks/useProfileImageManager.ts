import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";

import type { UploadProps } from "antd";

import { Upload } from "antd";

import { queryClient } from "@/lib/queryClient";

import { VALIDATION } from "@/shared/validation";

import { userMeQueryKey } from "../api/hooks/useGetMe";

import { useDeleteProfileImage } from "../api/hooks/useDeleteProfileImage";

import { useUploadProfileImage } from "../api/hooks/useUploadProfileImage";

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

export const useProfileImageManager = () => {
  const { t } = useTranslation();

  const {
    mutate: uploadMutate,
    isPending: isUploading,
  } = useUploadProfileImage();

  const {
    mutate: deleteMutate,
    isPending: isDeleting,
  } = useDeleteProfileImage();

  const beforeUpload: NonNullable<UploadProps["beforeUpload"]> = (file) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast.error(t(VALIDATION.imageType));
      return Upload.LIST_IGNORE;
    }

    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      toast.error(t(VALIDATION.imageMaxSize));
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const customRequest: NonNullable<UploadProps["customRequest"]> = ({
    file,
    onError,
    onSuccess,
  }) => {
    const uploadFile = file as File;

    uploadMutate(uploadFile, {
      onSuccess: (response) => {
        if (!response.isSuccess) {
          onError?.(new Error(response.message));
          return;
        }

        toast.success(
          response.message || t("user.profile.imageUploadSuccess"),
        );

        void queryClient.invalidateQueries({
          queryKey: userMeQueryKey,
        });

        onSuccess?.(response);
      },

      onError: (error) => {
        onError?.(error as Error);
      },
    });
  };

  const onDelete = () => {
    deleteMutate(undefined, {
      onSuccess: (response) => {
        if (!response.isSuccess) {
          return;
        }

        toast.success(
          response.message || t("user.profile.imageDeleteSuccess"),
        );

        void queryClient.invalidateQueries({
          queryKey: userMeQueryKey,
        });
      },
    });
  };

  return {
    beforeUpload,
    customRequest,
    onDelete,
    isUploading,
    isDeleting,
    isPending: isUploading || isDeleting,
  };
};