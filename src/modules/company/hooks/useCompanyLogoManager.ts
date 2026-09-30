import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import { queryClient } from "@/lib/queryClient";
import { availableCompaniesQueryKey } from "@/modules/authentication/api/hooks/availableCompaniesQueryKey";
import { VALIDATION } from "@/shared/validation";
import { useDeleteCompanyLogo } from "../api/hooks/useDeleteCompanyLogo";
import { useUploadCompanyLogo } from "../api/hooks/useUploadCompanyLogo";
import {
  companyLogoQueryKey,
  currentCompanyQueryKey,
} from "../api/hooks/companyQueryKeys";

const MAX_COMPANY_LOGO_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

const invalidateCompanyLogo = () => {
  void queryClient.invalidateQueries({ queryKey: currentCompanyQueryKey });
  void queryClient.invalidateQueries({ queryKey: companyLogoQueryKey });
  void queryClient.invalidateQueries({ queryKey: availableCompaniesQueryKey });
};

export const useCompanyLogoManager = () => {
  const { t } = useTranslation();
  const { mutate: uploadMutate, isPending: isUploading } =
    useUploadCompanyLogo();
  const { mutate: deleteMutate, isPending: isDeleting } =
    useDeleteCompanyLogo();

  const beforeUpload: NonNullable<UploadProps["beforeUpload"]> = (file) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast.error(t(VALIDATION.imageType));
      return Upload.LIST_IGNORE;
    }

    if (file.size > MAX_COMPANY_LOGO_BYTES) {
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
    uploadMutate(file as File, {
      onSuccess: (response) => {
        if (!response.isSuccess) {
          onError?.(new Error(response.message));
          return;
        }

        toast.success(response.message || t("company.logo.uploadSuccess"));
        invalidateCompanyLogo();
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

        toast.success(response.message || t("company.logo.deleteSuccess"));
        invalidateCompanyLogo();
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
