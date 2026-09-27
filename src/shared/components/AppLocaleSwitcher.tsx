import { Dropdown, type MenuProps } from "antd";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { type AppLocale } from "../../i18n/useLocale";
import { useLanguagePreference } from "@/modules/user/hooks/useLanguagePreference";

const AppLocaleSwitcher = ({ whiteIcon = false }: { whiteIcon?: boolean }) => {
  const { t } = useTranslation();
  const { locale, changeLanguage } = useLanguagePreference();

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

  return (
    <Dropdown menu={{ items, selectedKeys: [locale] }} trigger={["click"]}>
      <AppButton
        variant="default"
        aria-label={t("common.language")}
        icon={
          <Languages
            color={whiteIcon ? "white" : "currentColor"}
            size={18}
          />
        }
      />
    </Dropdown>
  );
};

export default AppLocaleSwitcher;
