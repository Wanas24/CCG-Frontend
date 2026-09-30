import { useTranslation } from "react-i18next";
import { AppInfoRows } from "@/shared/ANTD_UIComponents";
import type { TCompany } from "../types";

type Props = {
  company: TCompany;
};

const CompanyReadOnlyDetails = ({ company }: Props) => {
  const { t } = useTranslation();

  return (
    <AppInfoRows
      rows={[
        { label: t("company.fields.id"), value: String(company.id) },
        { label: t("company.fields.address"), value: company.address },
        { label: t("company.fields.timeZone"), value: company.timeZoneId },
      ]}
    />
  );
};

export default CompanyReadOnlyDetails;
