import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { queryClient } from "@/lib/queryClient";
import { useUpdateCompany } from "../api/hooks/useUpdateCompany";
import { currentCompanyQueryKey } from "../api/hooks/companyQueryKeys";
import { companyFormSchema, type CompanyFormValues } from "../schemas";
import type { TCompany } from "../types";

const toFormValues = (company: TCompany): CompanyFormValues => ({
  name: company.name,
  description: company.description ?? "",
  address: company.address,
  timeZoneId: company.timeZoneId,
});

export const useUpdateCompanyManager = (company: TCompany) => {
  const { t } = useTranslation();
  const { mutate: updateCompanyMutate, isPending } = useUpdateCompany();

  const { control, handleSubmit, setError, reset } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: toFormValues(company),
  });

  useEffect(() => {
    reset(toFormValues(company));
  }, [company, reset]);

  const onSubmit = (values: CompanyFormValues) => {
    updateCompanyMutate(values, {
      onSuccess: (response) => {
        if (!response.isSuccess) {
          applyApiFieldErrors(setError, response.data);
          return;
        }

        toast.success(response.message || t("company.edit.success"));
        void queryClient.invalidateQueries({ queryKey: currentCompanyQueryKey });
      },
      onError: (error) => {
        const result = getSimpleResultFromAxiosError(error);
        applyApiFieldErrors(setError, result?.data);
      },
    });
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isPending,
  };
};
