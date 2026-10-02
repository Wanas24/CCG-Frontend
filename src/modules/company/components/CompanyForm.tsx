import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useUpdateCompanyManager } from "../hooks/useUpdateCompanyManager";
import type { TCompany } from "../types";
import CompanyFormFields from "./CompanyFormFields";

type Props = {
  company: TCompany;
  canEdit: boolean;
};

const CompanyForm = ({ company, canEdit }: Props) => {
  const { t } = useTranslation();
  const { control, handleSubmit, onSubmit, isPending } =
    useUpdateCompanyManager(company);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={
        canEdit
          ? handleSubmit(onSubmit)
          : (event) => {
              event.preventDefault();
            }
      }
      noValidate
    >
      <CompanyFormFields control={control} disabled={!canEdit} />
      {canEdit ? (
        <AppButton htmlType="submit" variant="primary" loading={isPending}>
          {t("company.edit.save")}
        </AppButton>
      ) : null}
    </form>
  );
};

export default CompanyForm;
