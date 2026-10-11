import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AppFormPage, AppFormSection } from "@/shared/ANTD_UIComponents";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import ListsTabs from "../components/ListsTabs";
import { type ListsTabId } from "../listsTabs";
import UnitsList from "../units/components/UnitsList";
import ItemCatalogList from "../itemCatalog/components/ItemCatalogList";

const TAB_CONTENT: Record<ListsTabId, ReactNode> = {
  units: <UnitsList mode="manage" />,
  itemCatalog: <ItemCatalogList />,
};

const ListsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ListsTabId>("units");

  return (
    <div>
      <AppFormPage title={t("lists.title")} className="min-w-0 gap-4!">
        <AppFormSection className="min-w-0 gap-4!">
          <p className={`m-0 ${DesignTokens.typography.muted}`}>
            {t("lists.subtitle")}
          </p>

          <ListsTabs value={activeTab} onChange={setActiveTab} />

          <div className="min-w-0">{TAB_CONTENT[activeTab]}</div>
        </AppFormSection>
      </AppFormPage>
    </div>
  );
};

export default ListsPage;
