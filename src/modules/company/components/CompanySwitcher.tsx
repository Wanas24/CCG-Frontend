import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Dropdown, Tooltip } from "antd";
import { Building2, ChevronDown, Plus, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { hint } from "@/lib/feedback/hint";
import { AppButton, AppDivider } from "@/shared/ANTD_UIComponents";
import { useSwitchCompanyManager } from "../hooks/useSwitchCompanyManager";
import { COMPANY_ROUTES } from "../routes/paths";
import type { TUserCompany } from "../types";

type CompanyMarkProps = {
  logo?: string | null;
  name: string;
};

const CompanyMark = ({ logo, name }: CompanyMarkProps) => {
  const [failedLogo, setFailedLogo] = useState<string | null>(null);
  const showImage = Boolean(logo) && logo !== failedLogo;
  if (showImage && logo) {
    return (
      <img
        src={logo}
        alt={name}
        className={clsx(
          DesignTokens.media.avatarSm,
          "shrink-0 rounded-full object-cover border border-(--Grey300)",
        )}
        onError={() => setFailedLogo(logo)}
      />
    );
  }

  return (
    <span
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full border border-(--Grey300) bg-(--Grey100)",
        DesignTokens.media.avatarSm,
        DesignTokens.typography.muted,
      )}
      aria-hidden
    >
      <Building2 size={DesignTokens.media.iconSm} />
    </span>
  );
};

const getCompanyStatusKey = (
  company: TUserCompany,
  currentCompanyId: number | null,
) => {
  if (company.isDisabled) {
    return "company.switcher.disabled" as const;
  }

  if (company.isCurrent || company.id === currentCompanyId) {
    return "company.switcher.active" as const;
  }

  if (company.isManager) {
    return "company.switcher.manager" as const;
  }

  return undefined;
};

type CompanyRowProps = {
  company: TUserCompany;
  currentCompanyId: number | null;
  logo?: string | null;
  disabled: boolean;
  onSelect: (companyId: number) => void;
  onClose: () => void;
};

const CompanyRow = ({
  company,
  currentCompanyId,
  logo,
  disabled,
  onSelect,
  onClose,
}: CompanyRowProps) => {
  const { t } = useTranslation();
  const statusKey = getCompanyStatusKey(company, currentCompanyId);
  const status = statusKey ? t(statusKey) : undefined;
  const isSelected = company.isCurrent || company.id === currentCompanyId;

  return (
    <div className="flex min-w-0 items-center gap-1">
      <button
        type="button"
        role="menuitem"
        disabled={disabled}
        aria-current={isSelected ? "true" : undefined}
        className={clsx(
          "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-start",
          isSelected ? "bg-(--Primary100)" : "hover:bg-(--Grey100)",
          company.isDisabled && "text-(--Grey500)",
        )}
        onClick={() => onSelect(company.id)}
      >
        <CompanyMark logo={logo} name={company.name} />
        <span className="flex min-w-0 flex-col">
          <span
            className={clsx(
              DesignTokens.inputs.labelFontSize,
              DesignTokens.typography.emphasis,
              "truncate",
            )}
          >
            {company.name}
          </span>
          {status ? (
            <span
              className={clsx(
                DesignTokens.inputs.labelFontSize,
                DesignTokens.typography.muted,
                "truncate",
              )}
            >
              {status}
            </span>
          ) : null}
        </span>
      </button>

      {isSelected ? (
        <Tooltip title={t("company.switcher.settings")}>
          <Link
            to={COMPANY_ROUTES.root}
            role="menuitem"
            aria-label={t("company.switcher.settings")}
            className="flex shrink-0 items-center justify-center rounded-lg p-2 !text-(--Primary400) hover:bg-(--Grey100)"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            <Settings size={DesignTokens.media.iconSm} />
          </Link>
        </Tooltip>
      ) : null}
    </div>
  );
};

const CompanySwitcher = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    companies,
    currentCompany,
    currentCompanyId,
    currentCompanyLogo,
    isSwitching,
    switchCompany,
  } = useSwitchCompanyManager();

  const currentName = currentCompany?.name ?? t("auth.noCompany");

  const closeMenu = () => setOpen(false);

  const onSelectCompany = async (companyId: number) => {
    closeMenu();

    const switched = await switchCompany(companyId);

    if (switched) {
      navigate("/home");
    }
  };

  return (
    <Dropdown
      trigger={["click"]}
      open={open}
      disabled={isSwitching}
      destroyOnHidden
      onOpenChange={(nextOpen) => {
        if (isSwitching) {
          return;
        }

        if (nextOpen && !currentCompanyId && companies.length === 0) {
          hint("auth.noCompany");
        }

        setOpen(nextOpen);
      }}
      popupRender={() => (
        <div
          role="menu"
          className={clsx(
            "rounded-xl border border-(--Grey300) bg-(--app-surface) shadow",
            DesignTokens.layout.switcherMenu,
          )}
        >
          {companies.map((company) => (
            <CompanyRow
              key={company.id}
              company={company}
              currentCompanyId={currentCompanyId}
              logo={company.profileUrl}
              disabled={isSwitching}
              onSelect={onSelectCompany}
              onClose={closeMenu}
            />
          ))}

          <AppDivider className="mx-2!" />

          <Link
            to={COMPANY_ROUTES.create}
            role="menuitem"
            className={clsx(
              "flex items-center gap-2 rounded-lg px-2 py-2",
              DesignTokens.inputs.labelFontSize,
              DesignTokens.typography.emphasis,
              "!text-(--Primary400) hover:bg-(--Grey100)",
            )}
            onClick={closeMenu}
          >
            <Plus size={DesignTokens.media.iconSm} className="shrink-0" />
            <span className="truncate">{t("company.create.navLabel")}</span>
          </Link>
        </div>
      )}
    >
      <AppButton
        variant="default"
        loading={isSwitching}
        aria-label={t("company.switcher.label")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="h-auto! min-w-0 py-1!"
      >
        <span className={DesignTokens.layout.switcherTrigger}>
          <CompanyMark logo={currentCompanyLogo} name={currentName} />
          <span className="flex min-w-0 flex-1 flex-col items-start">
            <span
              className={clsx(
                DesignTokens.inputs.labelFontSize,
                DesignTokens.typography.muted,
                "truncate",
              )}
            >
              {t("company.switcher.label")}
            </span>
            <span
              className={clsx(
                DesignTokens.inputs.labelFontSize,
                DesignTokens.typography.emphasis,
                "w-full truncate text-start",
              )}
            >
              {currentName}
            </span>
          </span>
          <ChevronDown size={DesignTokens.media.iconSm} className="shrink-0" />
        </span>
      </AppButton>
    </Dropdown>
  );
};

export default CompanySwitcher;
