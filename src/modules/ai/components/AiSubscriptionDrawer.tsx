import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { InputNumber, Progress, Switch, theme } from "antd";
import { Info } from "lucide-react";
import { type Dayjs } from "dayjs";
import { toast } from "react-toastify";
import {
  AppButton,
  AppDatePicker,
  AppDrawer,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";
import { useLocale } from "@/i18n";
import { queryClient } from "@/lib/queryClient";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { useGetAiSubscription } from "../api/hooks/useGetAiSubscription";
import { useUpdateAiSubscription } from "../api/hooks/useUpdateAiSubscription";
import {
  aiSubscriptionQueryKey,
} from "../api/queryKeys/aiQueryKeys";
import {
  aiSubscriptionUpdateSchema,
  type AiSubscriptionUpdateFormValues,
} from "../schemas/aiSubscriptionUpdateSchema";
import type { TAiCompanyUserSubscriptionResponse } from "../types";
import {
  toAiSubscriptionApiUtc,
  toAiSubscriptionDatePickerValue,
} from "../utils/aiSubscriptionDates";
import {
  clampAiUsageProgress,
  formatAiUsageNumber,
} from "../utils/aiUsageFormat";

type Props = {
  open: boolean;
  userId: string | null;
  canUpdate: boolean;
  onClose: () => void;
};

const toFormValues = (
  subscription: TAiCompanyUserSubscriptionResponse,
): AiSubscriptionUpdateFormValues => ({
  isSubscribed: subscription.isSubscribed,
  subscribedFromUtc: subscription.subscribedFromUtc ?? null,
  subscribedToUtc: subscription.subscribedToUtc ?? null,
  hasUnlimitedUsage: subscription.hasUnlimitedUsage,
  monthlyTokenLimit: subscription.monthlyTokenLimit,
  monthlyMessageLimit: subscription.monthlyMessageLimit,
  historyMessageCount: subscription.historyMessageCount,
});

const AiSubscriptionDrawer = ({
  open,
  userId,
  canUpdate,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const { locale, isRtl } = useLocale();
  const { token } = theme.useToken();
  const { data, isPending, isError, refetch, isFetching } = useGetAiSubscription(
    userId,
    open && Boolean(userId),
  );
  const { mutate: updateSubscription, isPending: isSaving } =
    useUpdateAiSubscription();

  const subscription = data?.isSuccess ? data.data : undefined;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AiSubscriptionUpdateFormValues>({
    resolver: zodResolver(aiSubscriptionUpdateSchema),
    defaultValues: {
      isSubscribed: false,
      subscribedFromUtc: null,
      subscribedToUtc: null,
      hasUnlimitedUsage: false,
      monthlyTokenLimit: 0,
      monthlyMessageLimit: 0,
      historyMessageCount: 10,
    },
  });

  const hasUnlimitedUsage = useWatch({
    control,
    name: "hasUnlimitedUsage",
  });

  const fieldError = (message?: unknown) => {
    if (typeof message !== "string" || !message) {
      return undefined;
    }

    if (message.startsWith("ai.")) {
      return t(message as never);
    }

    return message;
  };

  useEffect(() => {
    if (subscription) {
      reset(toFormValues(subscription));
    }
  }, [subscription, reset]);

  const onSubmit = (values: AiSubscriptionUpdateFormValues) => {
    if (!userId || !canUpdate) {
      return;
    }

    updateSubscription(
      {
        userId,
        body: {
          isSubscribed: values.isSubscribed,
          subscribedFromUtc: values.subscribedFromUtc,
          subscribedToUtc: values.subscribedToUtc,
          hasUnlimitedUsage: values.hasUnlimitedUsage,
          monthlyTokenLimit: values.monthlyTokenLimit,
          monthlyMessageLimit: values.monthlyMessageLimit,
          historyMessageCount: values.historyMessageCount,
        },
      },
      {
        onSuccess: (response) => {
          if (!response.isSuccess) {
            applyApiFieldErrors(setError, response.data);
            return;
          }

          toast.success(
            response.message || t("ai.subscriptions.saveSuccess"),
          );
          void queryClient.invalidateQueries({
            queryKey: ["ai", "subscriptions"] as const,
          });
          void queryClient.invalidateQueries({
            queryKey: aiSubscriptionQueryKey(userId),
          });
        },
        onError: (error) => {
          const result = getSimpleResultFromAxiosError(error);
          applyApiFieldErrors(setError, result?.data);
        },
      },
    );
  };

  const tokenProgress =
    subscription && !subscription.hasUnlimitedUsage
      ? clampAiUsageProgress(
          subscription.usedTokens ?? 0,
          subscription.monthlyTokenLimit,
        )
      : null;
  const messageProgress =
    subscription && !subscription.hasUnlimitedUsage
      ? clampAiUsageProgress(
          subscription.usedMessages ?? 0,
          subscription.monthlyMessageLimit,
        )
      : null;

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      placement={isRtl ? "left" : "right"}
      title={t("ai.subscriptions.drawerTitle")}
      width={420}
      destroyOnHidden
      classNames={{ body: "flex flex-col gap-4" }}
    >
      {isPending && (
        <div aria-busy="true" aria-live="polite" className="flex flex-col gap-3">
          <p className="m-0 text-xs text-(--Grey600)">
            {t("ai.subscriptions.loadingDetails")}
          </p>
          <AppSkeleton active paragraph={{ rows: 4 }} />
          <AppSkeleton active paragraph={{ rows: 5 }} />
        </div>
      )}

      {!isPending && isError && (
        <div className="flex flex-col gap-3">
          <p className="m-0 text-sm text-(--statusR200)">
            {t("ai.subscriptions.loadError")}
          </p>
          <AppButton
            variant="secondary"
            loading={isFetching}
            onClick={() => {
              void refetch();
            }}
          >
            {t("ai.subscriptions.retry")}
          </AppButton>
        </div>
      )}

      {!isPending && !isError && subscription && (
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <p className="m-0 text-base font-semibold text-(--app-text)">
              {subscription.firstName} {subscription.lastName}
            </p>
            <p dir="ltr" className="m-0 text-sm text-(--Grey600)">
              {subscription.email}
            </p>
          </div>

          <section className="flex flex-col gap-2 border-t border-(--Grey300) pt-4">
            <h3 className="m-0 text-sm font-semibold text-(--app-text)">
              {t("ai.subscriptions.sections.usage")}
            </h3>

            {subscription.hasUnlimitedUsage ? (
              <p className="m-0 text-sm text-(--app-text)">
                {t("ai.subscriptions.unlimited")}
              </p>
            ) : (
              <>
                <div>
                  <p className="m-0 mb-1 text-xs text-(--Grey600)">
                    {t("ai.usage.tokens")}
                  </p>
                  <p dir="ltr" className="m-0 text-sm text-(--app-text)">
                    {formatAiUsageNumber(subscription.usedTokens ?? 0, locale)}{" "}
                    /{" "}
                    {formatAiUsageNumber(
                      subscription.monthlyTokenLimit,
                      locale,
                    )}
                  </p>
                  {tokenProgress !== null && (
                    <Progress
                      percent={tokenProgress}
                      showInfo={false}
                      size="small"
                      strokeColor={token.colorPrimary}
                    />
                  )}
                </div>

                <div>
                  <p className="m-0 mb-1 text-xs text-(--Grey600)">
                    {t("ai.usage.messages")}
                  </p>
                  <p dir="ltr" className="m-0 text-sm text-(--app-text)">
                    {formatAiUsageNumber(
                      subscription.usedMessages ?? 0,
                      locale,
                    )}{" "}
                    /{" "}
                    {formatAiUsageNumber(
                      subscription.monthlyMessageLimit,
                      locale,
                    )}
                  </p>
                  {messageProgress !== null && (
                    <Progress
                      percent={messageProgress}
                      showInfo={false}
                      size="small"
                      strokeColor={token.colorPrimary}
                    />
                  )}
                </div>
              </>
            )}
          </section>

          <section className="flex flex-col gap-3 border-t border-(--Grey300) pt-4">
            <h3 className="m-0 text-sm font-semibold text-(--app-text)">
              {t("ai.subscriptions.sections.subscription")}
            </h3>

            <Controller
              name="isSubscribed"
              control={control}
              render={({ field }) => (
                <label className="flex items-center justify-between gap-3 text-sm text-(--app-text)">
                  <span>{t("ai.subscriptions.fields.isSubscribed")}</span>
                  <Switch
                    checked={field.value}
                    disabled={!canUpdate || isSaving}
                    onChange={field.onChange}
                  />
                </label>
              )}
            />

            <Controller
              name="subscribedFromUtc"
              control={control}
              render={({ field }) => (
                <AppDatePicker
                  label={t("ai.subscriptions.fields.from")}
                  value={toAiSubscriptionDatePickerValue(field.value)}
                  disabled={!canUpdate || isSaving}
                  onChange={(value) => {
                    field.onChange(
                      toAiSubscriptionApiUtc((value as Dayjs | null) ?? null),
                    );
                  }}
                  errorMsg={fieldError(errors.subscribedFromUtc?.message)}
                />
              )}
            />

            <Controller
              name="subscribedToUtc"
              control={control}
              render={({ field }) => (
                <AppDatePicker
                  label={t("ai.subscriptions.fields.to")}
                  value={toAiSubscriptionDatePickerValue(field.value)}
                  disabled={!canUpdate || isSaving}
                  onChange={(value) => {
                    field.onChange(
                      toAiSubscriptionApiUtc((value as Dayjs | null) ?? null),
                    );
                  }}
                  errorMsg={fieldError(errors.subscribedToUtc?.message)}
                />
              )}
            />
          </section>

          <section className="flex flex-col gap-3 border-t border-(--Grey300) pt-4">
            <h3 className="m-0 text-sm font-semibold text-(--app-text)">
              {t("ai.subscriptions.sections.configuration")}
            </h3>

            <Controller
              name="hasUnlimitedUsage"
              control={control}
              render={({ field }) => (
                <label className="flex items-center justify-between gap-3 text-sm text-(--app-text)">
                  <span>{t("ai.subscriptions.fields.unlimited")}</span>
                  <Switch
                    checked={field.value}
                    disabled={!canUpdate || isSaving}
                    onChange={field.onChange}
                  />
                </label>
              )}
            />

            <Controller
              name="monthlyTokenLimit"
              control={control}
              render={({ field }) => (
                <label className="flex flex-col gap-1 text-sm text-(--app-text)">
                  <span>{t("ai.subscriptions.fields.monthlyTokens")}</span>
                  <InputNumber
                    className="w-full!"
                    min={0}
                    disabled={!canUpdate || isSaving || hasUnlimitedUsage}
                    value={field.value}
                    onChange={(value) => field.onChange(value ?? 0)}
                  />
                  {errors.monthlyTokenLimit?.message ? (
                    <span className="text-xs text-(--statusR200)">
                      {fieldError(errors.monthlyTokenLimit.message)}
                    </span>
                  ) : null}
                </label>
              )}
            />

            <Controller
              name="monthlyMessageLimit"
              control={control}
              render={({ field }) => (
                <label className="flex flex-col gap-1 text-sm text-(--app-text)">
                  <span>{t("ai.subscriptions.fields.monthlyMessages")}</span>
                  <InputNumber
                    className="w-full!"
                    min={0}
                    disabled={!canUpdate || isSaving || hasUnlimitedUsage}
                    value={field.value}
                    onChange={(value) => field.onChange(value ?? 0)}
                  />
                  {errors.monthlyMessageLimit?.message ? (
                    <span className="text-xs text-(--statusR200)">
                      {fieldError(errors.monthlyMessageLimit.message)}
                    </span>
                  ) : null}
                </label>
              )}
            />

            <Controller
              name="historyMessageCount"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1 text-sm text-(--app-text)">
                  <label className="flex flex-col gap-1">
                    <span>{t("ai.subscriptions.fields.historyMessages")}</span>
                    <InputNumber
                      className="w-full!"
                      min={0}
                      max={100}
                      disabled={!canUpdate || isSaving}
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? 0)}
                    />
                  </label>
                  {errors.historyMessageCount?.message ? (
                    <span className="text-xs text-(--statusR200)">
                      {fieldError(errors.historyMessageCount.message)}
                    </span>
                  ) : null}
                  <p className="m-0 flex items-start gap-1.5 text-xs text-(--Grey600)">
                    <Info
                      size={14}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0"
                    />
                    <span>{t("ai.subscriptions.fields.historyMessagesHint")}</span>
                  </p>
                </div>
              )}
            />
          </section>

          <div className="mt-auto flex justify-end gap-2 border-t border-(--Grey300) pt-3">
            <AppButton
              variant="secondary"
              htmlType="button"
              disabled={isSaving}
              onClick={onClose}
            >
              {t("ai.subscriptions.cancel")}
            </AppButton>
            {canUpdate ? (
              <AppButton
                variant="primary"
                htmlType="submit"
                loading={isSaving}
                disabled={isSaving}
              >
                {t("ai.subscriptions.save")}
              </AppButton>
            ) : null}
          </div>
        </form>
      )}
    </AppDrawer>
  );
};

export default AiSubscriptionDrawer;
