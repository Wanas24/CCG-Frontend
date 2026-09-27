import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useCreateCompanyManager } from "../hooks/useCreateCompanyManager";
import CompanyFormFields from "./CompanyFormFields";

const CreateCompanyForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, onSubmit, isPending } =
    useCreateCompanyManager();

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <CompanyFormFields control={control} />
      <AppButton htmlType="submit" variant="primary" loading={isPending}>
        {t("company.create.submit")}
      </AppButton>
    </form>
  );
};

export default CreateCompanyForm;
