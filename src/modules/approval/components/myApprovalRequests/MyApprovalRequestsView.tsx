import clsx from "clsx";
import { RefreshCw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import {
  AppButton,
  AppDropDownSelect,
  AppInput,
} from "@/shared/ANTD_UIComponents";
import type { MyApprovalRequestsApi } from "../../hooks/useMyApprovalRequests";
import MyApprovalRequestDetail from "./MyApprovalRequestDetail";
import MyApprovalRequestDetailSkeleton from "./MyApprovalRequestDetailSkeleton";
import MyApprovalRequestList from "./MyApprovalRequestList";
import MyApprovalRequestListSkeleton from "./MyApprovalRequestListSkeleton";
import MyApprovalRequestStats from "./MyApprovalRequestStats";
import MyApprovalRequestStatsSkeleton from "./MyApprovalRequestStatsSkeleton";

type Props = {
  studio: MyApprovalRequestsApi;
};

const MyApprovalRequestsView = ({ studio }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[18px]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className={clsx(DesignTokens.typography.headingSm, "text-2xl!")}>
            {t("approval.myRequests.title")}
          </h1>
          <p className={clsx("m-0 mt-1", DesignTokens.typography.muted)}>
            {t("approval.myRequests.subtitle")}
          </p>
        </div>
        <AppButton
          variant="secondary"
          icon={<RefreshCw size={16} />}
          loading={studio.isFetching}
          onClick={() => studio.reload()}
        >
          {t("approval.myRequests.reload")}
        </AppButton>
      </header>

      {studio.isCountsInitialLoading ? (
        <MyApprovalRequestStatsSkeleton />
      ) : (
        <MyApprovalRequestStats studio={studio} />
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="min-w-[13.75rem] flex-1">
          <AppInput
            value={studio.search}
            onChange={(event) => studio.setSearch(event.target.value)}
            placeholder={t("approval.myRequests.searchPlaceholder")}
            prefix={<Search size={16} className="text-(--Grey500)" />}
            allowClear
            aria-label={t("approval.myRequests.searchPlaceholder")}
          />
        </div>
        <div className="min-w-[10rem]">
          <AppDropDownSelect
            value={studio.entityType || undefined}
            allowClear
            placeholder={t("approval.myRequests.allEntities")}
            aria-label={t("approval.myRequests.entityType")}
            options={[
              ...studio.entityTypes.map((entity) => ({
                value: entity.key,
                label: entity.value || entity.key,
              })),
            ]}
            onChange={(value) =>
              studio.setEntityTypeFilter(
                typeof value === "string" ? value : "",
              )
            }
          />
        </div>
      </div>

      {studio.isError ? (
        <p className="m-0 rounded-xl border border-(--statusR200) bg-(--statusR100) px-3 py-2.5 text-sm text-(--statusR200)">
          {studio.errorMessage || t("approval.myRequests.loadFailed")}
        </p>
      ) : null}

      <div
        className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(20rem,26.25rem)_minmax(0,1fr)]"
        aria-busy={studio.isListFetching || undefined}
      >
        {studio.isListFetching ? (
          <MyApprovalRequestListSkeleton />
        ) : (
          <MyApprovalRequestList studio={studio} />
        )}
        {studio.isListFetching ? (
          <MyApprovalRequestDetailSkeleton />
        ) : (
          <MyApprovalRequestDetail studio={studio} />
        )}
      </div>
    </div>
  );
};

export default MyApprovalRequestsView;
