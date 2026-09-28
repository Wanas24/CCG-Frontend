import { Dropdown, type MenuProps } from "antd";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { type AppLocale } from "../../i18n/useLocale";
import { useLanguagePreference } from "@/modules/user/hooks/useLanguagePreference";

type Props = {
  whiteIcon?: boolean;
  showLabel?: boolean;
};

const AppLocaleSwitcher = ({ whiteIcon = false, showLabel = false }: Props) => {
  const { t } = useTranslation();
  const { locale, changeLanguage } = useLanguagePreference();
  const label = t("common.language");

  const items: MenuProps["items"] = [
    {
      key: "en",
      label: t("common.english"),
      onClick: () => changeLanguage("en" satisfies AppLocale),
    },
    {
      key: "ar",
      label: t("common.arabic"),
      onClick: () => changeLanguage("ar" satisfies AppLocale),
    },
  ];

  const trigger = (
    <AppButton
      variant="default"
      aria-label={label}
      aria-haspopup="menu"
      iconPlacement={"start"}
      className={
        showLabel
          ? "w-full !justify-start hover:bg-(--Grey100)!"
          : undefined
      }
      icon={
        <Languages
          color={whiteIcon ? "white" : "currentColor"}
          size={18}
        />
      }
    >
      {showLabel ? label : null}
    </AppButton>
  );

  return (
    <Dropdown menu={{ items, selectedKeys: [locale] }} trigger={["click"]}>
      {showLabel ? <span className="block w-full">{trigger}</span> : trigger}
    </Dropdown>
  );
};

export default AppLocaleSwitcher;
