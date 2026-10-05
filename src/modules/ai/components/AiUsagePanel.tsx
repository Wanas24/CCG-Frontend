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
      <div className="flex min-w-0 flex-col gap-2 rounded-md border border-(--Grey300) bg-(--app-surface) px-2 py-2">
        <div className="flex min-w-0 items-baseline justify-between gap-2">
          <p className="m-0 truncate text-[0.65rem] font-medium leading-tight text-(--Grey600)">
            {title}
          </p>
          <p
            className="m-0 shrink-0 text-xs font-semibold leading-tight text-(--app-text)"
            dir="ltr"
          >
            {unlimited ? (
              <span className="font-normal text-(--Grey600)">
                {unlimitedLabel}
              </span>
            ) : (
              <>
                {formatAiUsageNumber(used, locale)}
                <span className="font-normal text-(--Grey600)">
                  /{formatAiUsageNumber(limit, locale)}
                </span>
              </>
            )}
          </p>
        </div>
        {!unlimited && progress !== null && (
          <Progress
            percent={progress}
            showInfo={false}
            size="small"
            status="normal"
            strokeColor={exhausted ? undefined : primaryColor}
            aria-label={title}
            className="m-0! leading-none [&_.ant-progress-outer]:pe-0! [&_.ant-progress-inner]:h-1!"
          />
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

const resolveIsUsageActive = (
  isSubscribed: boolean,
  period: TAiQuotaSnapshot | null | undefined,
) => {
  if (!isSubscribed || !period) {
    return false;
  }

  if (period.hasUnlimitedUsage) {
    return true;
  }

  return (
    (period.remainingTokens ?? 0) > 0 &&
    (period.remainingMessages ?? 0) > 0
  );
};

const AiUsagePanel = ({ className, layout = "panel" }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { token } = theme.useToken();
  const { data, isPending, isError, refetch, isFetching } = useGetAiUsage();

  const usage = data?.isSuccess ? data.data : undefined;
  const period: TAiQuotaSnapshot | null | undefined = usage?.currentPeriod;
  const isFooter = layout === "footer";
  const isUsageActive = resolveIsUsageActive(
    usage?.isSubscribed ?? false,
    period,
  );

  return (
    <aside
      className={clsx(
        "flex flex-col bg-(--Grey100)",
        isFooter
          ? "shrink-0 gap-1 px-3 pb-2 pt-0.5"
          : "min-h-0 w-full flex-1 gap-3 overflow-y-auto p-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <h3
          className={clsx(
            "m-0 min-w-0 truncate font-semibold text-(--app-text)",
            isFooter ? "text-[0.7rem] leading-tight" : "text-base",
          )}
        >
          {t("ai.usage.title")}
        </h3>

        {usage && (
          <span
            className={clsx(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 font-medium leading-none",
              isFooter ? "text-[0.6rem]" : "text-[0.7rem]",
              isUsageActive
                ? "bg-(--statusG100) text-(--statusG200)"
                : "bg-(--statusR100) text-(--statusR200)",
            )}
          >
            <span
              aria-hidden="true"
              className={clsx(
                "size-1.5 rounded-full",
                isUsageActive ? "bg-(--statusG200)" : "bg-(--statusR200)",
              )}
            />
            {isUsageActive ? t("ai.usage.active") : t("ai.usage.notActive")}
          </span>
        )}
      </div>

      {isPending && (
        <div
          className={clsx(
            isFooter ? "flex flex-col gap-1" : "flex flex-col gap-3",
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
                className="rounded-md border border-(--Grey300) bg-(--app-surface) px-2 py-1"
              />
              <AppSkeleton
                active
                paragraph={{ rows: 1 }}
                title={{ width: "60%" }}
                className="rounded-md border border-(--Grey300) bg-(--app-surface) px-2 py-1"
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
                isFooter ? "flex flex-col gap-1" : "flex flex-col gap-3",
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
