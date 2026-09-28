import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useUpdateCompanyManager } from "../hooks/useUpdateCompanyManager";
import type { TCompany } from "../types";
import CompanyFormFields from "./CompanyFormFields";

type Props = {
  company: TCompany;
};

const CompanyForm = ({ company }: Props) => {
  const { t } = useTranslation();
  const { control, handleSubmit, onSubmit, isPending } =
    useUpdateCompanyManager(company);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <CompanyFormFields control={control} />
      <AppButton htmlType="submit" variant="primary" loading={isPending}>
        {t("company.edit.save")}
      </AppButton>
    </form>
  );
};

export default CompanyForm;
