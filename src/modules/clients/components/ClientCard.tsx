import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import type { TClient } from "../types/client";

type Props = {
  client: TClient;
};

const ClientCard = ({ client }: Props) => {
  const { t } = useTranslation();

  return (
    <article className="flex min-h-28 min-w-0 flex-col gap-2 rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4 text-start">
      <div className="min-w-0">
        <h3
          className={clsx(
            "m-0 truncate text-base font-semibold",
            DesignTokens.typography.headingSm,
          )}
          dir="auto"
        >
          {client.name.trim() || t("clients.unnamed")}
        </h3>
        <p className={clsx("m-0 mt-1 text-xs", DesignTokens.typography.muted)}>
          {t("clients.idLabel", { id: client.id })}
        </p>
      </div>
    </article>
  );
};

export default ClientCard;
