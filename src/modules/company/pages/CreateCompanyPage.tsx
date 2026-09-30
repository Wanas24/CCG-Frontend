import { useTranslation } from "react-i18next";
import { AppFormPage, AppFormSection } from "@/shared/ANTD_UIComponents";
import CreateCompanyForm from "../components/CreateCompanyForm";

const CreateCompanyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <AppFormPage title={t("company.create.title")}>
        <AppFormSection>
          <p className="text-sm text-(--Grey600)">{t("company.create.subtitle")}</p>
          <CreateCompanyForm />
        </AppFormSection>
      </AppFormPage>
    </div>
  );
};

export default CreateCompanyPage;
