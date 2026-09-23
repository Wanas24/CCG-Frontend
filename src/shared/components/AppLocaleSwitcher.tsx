import { Dropdown, type MenuProps } from "antd";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { type AppLocale, useLocale } from "../../i18n/useLocale";

const AppLocaleSwitcher = () => {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  const items: MenuProps["items"] = [
    {
      key: "en",
      label: t("common.english"),
      onClick: () => setLocale("en" satisfies AppLocale),
    },
    {
      key: "ar",
      label: t("common.arabic"),
      onClick: () => setLocale("ar" satisfies AppLocale),
    },
  ];

  return (
    <Dropdown menu={{ items, selectedKeys: [locale] }} trigger={["click"]}>
      <AppButton
        variant="default"
        aria-label={t("common.language")}
        icon={<Languages color="white" size={18} />}
      />
    </Dropdown>
  );
};

export default AppLocaleSwitcher;
