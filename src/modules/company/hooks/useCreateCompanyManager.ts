import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { useCreateCompany } from "../api/hooks/useCreateCompany";
import { useSwitchCompanyManager } from "./useSwitchCompanyManager";
import { companyFormSchema, type CompanyFormValues } from "../schemas";
import { getDefaultTimeZoneId } from "../utils/timeZones";
import { COMPANY_ROUTES } from "../routes/paths";

export const useCreateCompanyManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: createCompanyMutate, isPending: isCreating } =
    useCreateCompany();
  const { switchCompany, isSwitching } = useSwitchCompanyManager();

  const { control, handleSubmit, setError } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      timeZoneId: getDefaultTimeZoneId(),
    },
  });

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      const response = await createCompanyMutate(values);

      if (!response.isSuccess || response.data === undefined) {
        applyApiFieldErrors(setError, response.data);
        return;
      }

      const switched = await switchCompany(response.data);

      if (!switched) {
        return;
      }

      toast.success(response.message || t("company.create.success"));
      navigate(COMPANY_ROUTES.root, { replace: true });
    } catch (error) {
      const result = getSimpleResultFromAxiosError(error);
      applyApiFieldErrors(setError, result?.data);
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isPending: isCreating || isSwitching,
  };
};
