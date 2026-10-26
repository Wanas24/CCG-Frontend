import clsx from "clsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n/useLocale";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { CLIENTS_ROUTES } from "../routes/paths";
import type { TClient } from "../types/client";

type Props = {
  client: TClient;
  canDelete?: boolean;
  onDelete?: () => void;
};

const ClientWorkspaceHeader = ({
  client,
  canDelete = false,
  onDelete,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRtl } = useLocale();
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <header className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <AppButton
          variant="secondary"
          icon={<BackArrow size={16} />}
          className="w-fit!"
          onClick={() => navigate(CLIENTS_ROUTES.root)}
        >
          {t("clients.workspace.back")}
        </AppButton>
        {canDelete ? (
          <AppButton variant="delete" className="w-fit!" onClick={onDelete}>
            {t("clients.form.delete")}
          </AppButton>
        ) : null}
      </div>

      <div className="min-w-0">
        <h1
          className={clsx(
            "m-0 text-2xl font-semibold",
            DesignTokens.typography.headingSm,
          )}
          dir="auto"
        >
          {client.name?.trim() || t("clients.unnamed")}
        </h1>
        <p className={clsx("m-0 mt-1 text-sm", DesignTokens.typography.muted)}>
          {t("clients.idLabel", { id: client.id })}
          {" · "}
          {t("clients.workspace.projectsCount", {
            count: client.projectsCount,
          })}
        </p>
      </div>
    </header>
  );
};

export default ClientWorkspaceHeader;
