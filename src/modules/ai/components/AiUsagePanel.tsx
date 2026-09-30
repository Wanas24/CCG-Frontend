import { useTranslation } from "react-i18next";
import { Progress, theme } from "antd";
import clsx from "clsx";
import { AppButton, AppSkeleton } from "@/shared/ANTD_UIComponents";
import { useLocale } from "@/i18n";
import { useGetAiUsage } from "../api/hooks/useGetAiUsage";
import type { TAiQuotaSnapshot } from "../types";
import {
  clampAiUsageProgress,
  formatAiUsageNumber,
} from "../utils/aiUsageFormat";
import AiUsageCard from "./AiUsageCard";

type Props = {
  className?: string;
};

type QuotaMetricProps = {
  title: string;
  used: number;
  limit: number;
  remaining?: number | null;
  unlimited: boolean;
  locale: string;
  usedLabel: string;
  remainingLabel: string;
  unlimitedLabel: string;
  exhausted: boolean;
  primaryColor: string;
};

const QuotaMetric = ({
  title,
  used,
  limit,
  remaining,
  unlimited,
  locale,
  usedLabel,
  remainingLabel,
  unlimitedLabel,
  exhausted,
  primaryColor,
}: QuotaMetricProps) => {
  const progress = unlimited ? null : clampAiUsageProgress(used, limit);
  const hasRemaining = remaining !== undefined && remaining !== null;

  return (
    <AiUsageCard title={title}>
      {unlimited ? (
        <>
          <p className="m-0 text-sm font-medium text-(--app-text)">
            {unlimitedLabel}
          </p>
          <p className="m-0 text-xs text-(--Grey600)">
            {usedLabel}: {formatAiUsageNumber(used, locale)}
          </p>
        </>
      ) : (
        <>
          <p className="m-0 text-sm font-medium text-(--app-text)" dir="ltr">
            {formatAiUsageNumber(used, locale)}
            <span className="text-(--Grey600)">
              {" "}
              / {formatAiUsageNumber(limit, locale)}
            </span>
          </p>

          {progress !== null && (
            <Progress
              percent={progress}
              showInfo={false}
              size="small"
              status="normal"
              strokeColor={primaryColor}
              aria-label={title}
            />
          )}

          {hasRemaining && (
            <p
              className={clsx(
                "m-0 text-xs",
                exhausted
                  ? "font-medium text-(--statusR200)"
                  : "text-(--Grey600)",
              )}
            >
              {remainingLabel}: {formatAiUsageNumber(remaining, locale)}
            </p>
          )}
        </>
      )}
    </AiUsageCard>
  );
};

const isExhausted = (remaining?: number | null) =>
  remaining !== undefined && remaining !== null && remaining <= 0;

const AiUsagePanel = ({ className }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { token } = theme.useToken();
  const { data, isPending, isError, refetch, isFetching } = useGetAiUsage();

  const usage = data?.isSuccess ? data.data : undefined;
  const period: TAiQuotaSnapshot | null | undefined = usage?.currentPeriod;

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

      {isPending && (
        <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
          <p className="m-0 text-xs text-(--Grey600)">{t("ai.usage.loading")}</p>
          <AppSkeleton active paragraph={{ rows: 3 }} title={{ width: "40%" }} />
          <AppSkeleton active paragraph={{ rows: 3 }} title={{ width: "45%" }} />
        </div>
      )}

      {!isPending && isError && (
        <AiUsageCard
          title={t("ai.usage.errorTitle")}
          description={t("ai.usage.errorDescription")}
        >
          <AppButton
            variant="secondary"
            loading={isFetching}
            onClick={() => {
              void refetch();
            }}
            className="mt-1!"
          >
            {t("ai.usage.retry")}
          </AppButton>
        </AiUsageCard>
      )}

      {!isPending && !isError && !usage && (
        <AiUsageCard
          title={t("ai.usage.period")}
          description={t("ai.usage.periodUnavailable")}
        >
          <AppButton
            variant="secondary"
            loading={isFetching}
            onClick={() => {
              void refetch();
            }}
            className="mt-1!"
          >
            {t("ai.usage.retry")}
          </AppButton>
        </AiUsageCard>
      )}

      {!isPending && !isError && usage && (
        <>
          {period ? (
            <>
              <QuotaMetric
                title={t("ai.usage.tokens")}
                used={period.usedTokens}
                limit={period.monthlyTokenLimit}
                remaining={period.remainingTokens}
                unlimited={period.hasUnlimitedUsage}
                locale={locale}
                usedLabel={t("ai.usage.used")}
                remainingLabel={t("ai.usage.remaining")}
                unlimitedLabel={t("ai.usage.unlimited")}
                exhausted={isExhausted(period.remainingTokens)}
                primaryColor={token.colorPrimary}
              />

              <QuotaMetric
                title={t("ai.usage.messages")}
                used={period.usedMessages}
                limit={period.monthlyMessageLimit}
                remaining={period.remainingMessages}
                unlimited={period.hasUnlimitedUsage}
                locale={locale}
                usedLabel={t("ai.usage.used")}
                remainingLabel={t("ai.usage.remaining")}
                unlimitedLabel={t("ai.usage.unlimited")}
                exhausted={isExhausted(period.remainingMessages)}
                primaryColor={token.colorPrimary}
              />
            </>
          ) : (
            <AiUsageCard
              title={t("ai.usage.period")}
              description={t("ai.usage.periodUnavailable")}
            />
          )}
        </>
      )}
    </aside>
  );
};

export default AiUsagePanel;
