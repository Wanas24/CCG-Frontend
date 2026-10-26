import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useClientOverviewManager } from "../hooks/useClientOverviewManager";
import type { TClient } from "../types/client";
import ClientFormFields from "./ClientFormFields";

type Props = {
  client: TClient;
};

const ClientOverviewPanel = ({ client }: Props) => {
  const { t } = useTranslation();
  const manager = useClientOverviewManager(client);
  const fieldsDisabled =
    !manager.canEdit || !manager.editing || manager.isSaving;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="m-0 text-base font-semibold text-(--app-text)">
            {t("clients.workspace.sections.overview")}
          </h2>
          <p className={`m-0 mt-1 text-sm ${DesignTokens.typography.muted}`}>
            {manager.canEdit
              ? manager.editing
                ? t("clients.form.editSubtitle")
                : t("clients.form.readOnlyHint")
              : t("clients.form.readOnlyNoPermission")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {manager.canEdit && !manager.editing ? (
            <AppButton className="w-fit!" onClick={manager.startEdit}>
              {t("clients.form.edit")}
            </AppButton>
          ) : null}
          {manager.canEdit && manager.editing ? (
            <>
              <AppButton
                variant="secondary"
                className="w-fit!"
                disabled={manager.isSaving}
                onClick={manager.cancelEdit}
              >
                {t("clients.form.cancel")}
              </AppButton>
              <AppButton
                htmlType="submit"
                form="client-overview-form"
                className="w-fit!"
                loading={manager.isSaving}
              >
                {t("clients.form.save")}
              </AppButton>
            </>
          ) : null}
        </div>
      </div>

      <form
        id="client-overview-form"
        onSubmit={manager.submitUpdate}
        noValidate
      >
        <ClientFormFields
          control={manager.form.control}
          disabled={fieldsDisabled}
        />
      </form>
    </div>
  );
};

export default ClientOverviewPanel;
