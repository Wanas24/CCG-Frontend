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
  layout?: UsageLayout;
};

type UsageLayout = "panel" | "footer";

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
  layout: UsageLayout;
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
  layout,
}: QuotaMetricProps) => {
  const progress = unlimited ? null : clampAiUsageProgress(used, limit);
  const hasRemaining = remaining !== undefined && remaining !== null;

  if (layout === "footer") {
    return (
      <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-(--Grey300) bg-(--app-surface) p-2">
        <p className="m-0 truncate text-[0.7rem] font-medium text-(--Grey600)">
          {title}
        </p>
        <p
          className="m-0 truncate text-sm font-semibold text-(--app-text)"
          dir="ltr"
        >
          {formatAiUsageNumber(used, locale)}
          {!unlimited && (
            <span className="font-normal text-(--Grey600)">
              {" "}
              / {formatAiUsageNumber(limit, locale)}
            </span>
          )}
        </p>
        {unlimited ? (
          <p className="m-0 truncate text-[0.7rem] text-(--Grey600)">
            {unlimitedLabel}
          </p>
        ) : (
          progress !== null && (
            <Progress
              percent={progress}
              showInfo={false}
              size="small"
              status="normal"
              strokeColor={exhausted ? undefined : primaryColor}
              aria-label={title}
              className="m-0! leading-none [&_.ant-progress-outer]:pe-0!"
            />
          )
        )}
      </div>
    );
  }

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

const AiUsagePanel = ({ className, layout = "panel" }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { token } = theme.useToken();
  const { data, isPending, isError, refetch, isFetching } = useGetAiUsage();

  const usage = data?.isSuccess ? data.data : undefined;
  const period: TAiQuotaSnapshot | null | undefined = usage?.currentPeriod;
  const isFooter = layout === "footer";

  return (
    <aside
      className={clsx(
        "flex flex-col bg-(--Grey100)",
        isFooter
          ? "shrink-0 gap-1.5 px-3 pb-3 pt-1"
          : "min-h-0 w-full flex-1 gap-3 overflow-y-auto p-3",
        className,
      )}
    >
      <h3
        className={clsx(
          "m-0 font-semibold text-(--app-text)",
          isFooter ? "text-xs" : "text-base",
        )}
      >
        {t("ai.usage.title")}
      </h3>

      {isPending && (
        <div
          className={clsx(
            isFooter ? "grid grid-cols-2 gap-2" : "flex flex-col gap-3",
          )}
          aria-busy="true"
          aria-live="polite"
        >
          {isFooter ? (
            <>
              <AppSkeleton
                active
                paragraph={{ rows: 1 }}
                title={{ width: "60%" }}
                className="rounded-lg border border-(--Grey300) bg-(--app-surface) p-2"
              />
              <AppSkeleton
                active
                paragraph={{ rows: 1 }}
                title={{ width: "60%" }}
                className="rounded-lg border border-(--Grey300) bg-(--app-surface) p-2"
              />
            </>
          ) : (
            <>
              <p className="m-0 text-xs text-(--Grey600)">
                {t("ai.usage.loading")}
              </p>
              <AppSkeleton
                active
                paragraph={{ rows: 3 }}
                title={{ width: "40%" }}
              />
              <AppSkeleton
                active
                paragraph={{ rows: 3 }}
                title={{ width: "45%" }}
              />
            </>
          )}
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
            <div
              className={clsx(
                isFooter ? "grid grid-cols-2 gap-2" : "flex flex-col gap-3",
              )}
            >
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
                layout={layout}
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
                layout={layout}
              />
            </div>
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
