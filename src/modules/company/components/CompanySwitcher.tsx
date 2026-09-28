import { Link } from "react-router";
import { Dropdown, type MenuProps } from "antd";
import { Building2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { hint } from "@/lib/feedback/hint";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useSwitchCompanyManager } from "../hooks/useSwitchCompanyManager";
import { COMPANY_ROUTES } from "../routes/paths";

const CompanySwitcher = () => {
  const { t } = useTranslation();
  const {
    companies,
    currentCompany,
    currentCompanyId,
    isSwitching,
    switchCompany,
  } = useSwitchCompanyManager();

  const currentName = currentCompany?.name ?? t("auth.noCompany");

  const items: MenuProps["items"] = [
    ...companies.map((company) => ({
      key: String(company.id),
      disabled: isSwitching,
      label: (
        <div className="flex items-center justify-between gap-4">
          <span className={company.isDisabled ? "text-(--Grey500)" : undefined}>
            {company.name}
          </span>
          {(company.isCurrent || company.id === currentCompanyId) && (
            <Check size={16} />
          )}
        </div>
      ),
    })),
    { type: "divider" },
    {
      key: "manage",
      label: <Link to={COMPANY_ROUTES.root}>{t("company.switcher.details")}</Link>,
    },
    {
      key: "create",
      label: <Link to={COMPANY_ROUTES.create}>{t("company.create.navLabel")}</Link>,
    },
  ];

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "create" || key === "manage") {
      return;
    }

    if (!companies.length || !key) {
      hint("auth.noCompany");
      return;
    }

    void switchCompany(Number(key));
  };

  return (
    <Dropdown
      menu={{
        items,
        onClick: onMenuClick,
        selectedKeys: currentCompanyId ? [String(currentCompanyId)] : [],
      }}
      trigger={["click"]}
      disabled={isSwitching}
      onOpenChange={(open) => {
        if (open && !currentCompanyId && companies.length === 0) {
          hint("auth.noCompany");
        }
      }}
    >
      <AppButton
        variant="default"
        loading={isSwitching}
        aria-label={t("company.switcher.label")}
        icon={<Building2 size={18} />}
      >
        <span className="max-w-40 truncate">{currentName}</span>
      </AppButton>
    </Dropdown>
  );
};

export default CompanySwitcher;
