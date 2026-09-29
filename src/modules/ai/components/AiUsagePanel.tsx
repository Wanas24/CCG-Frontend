import { useTranslation } from "react-i18next";
import clsx from "clsx";
import AiUsageCard from "./AiUsageCard";

type Props = {
  className?: string;
};

const AiUsagePanel = ({ className }: Props) => {
  const { t } = useTranslation();

  return (
    <aside
      className={clsx(
        "flex w-68 shrink-0 flex-col gap-3 overflow-y-auto border-s border-(--Grey300) bg-(--Grey100) p-4",
        className,
      )}
    >
      <h3 className="m-0 text-base font-semibold text-(--app-text)">
        {t("ai.usage.title")}
      </h3>

      <AiUsageCard
        title={t("ai.usage.tokens")}
        description={t("ai.usage.noUsage")}
      />
      <AiUsageCard
        title={t("ai.usage.messages")}
        description={t("ai.usage.noUsage")}
      />
      <AiUsageCard
        title={t("ai.usage.subscription")}
        description={t("ai.usage.subscriptionNotLoaded")}
      />
      <AiUsageCard
        title={t("ai.usage.response")}
        description={t("ai.usage.responseWaiting")}
      />
      <AiUsageCard
        title={t("ai.usage.tools")}
        description={t("ai.usage.noTools")}
      />
      <AiUsageCard
        title={t("ai.usage.warnings")}
        description={t("ai.usage.noWarnings")}
      />
    </aside>
  );
};

export default AiUsagePanel;
