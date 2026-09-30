import { useState } from "react";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Input, Select } from "antd";
import {
  AppButton,
  AppFormPage,
  AppFormSection,
} from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useGetAiSubscriptions } from "../api/hooks/useGetAiSubscriptions";
import {
  useAiSubscriptionListState,
  type TriState,
} from "../hooks/useAiSubscriptionListState";
import type { TAiCompanyUserSubscriptionResponse } from "../types";
import AiSubscriptionDrawer from "../components/AiSubscriptionDrawer";
import AiSubscriptionTable from "../components/AiSubscriptionTable";

const AiSubscriptionManagementPage = () => {
  const { t } = useTranslation();
  const { hasPermission, isLoading: isPermissionsLoading } = usePermissions();
  const canGet = hasPermission(PermissionsList.AiSubscriptionGet);
  const canUpdate = hasPermission(PermissionsList.AiSubscriptionUpdate);

  const listState = useAiSubscriptionListState();
  const { data, isPending, isError, isFetching, refetch } =
    useGetAiSubscriptions(listState.params, canGet);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const pageData = data?.isSuccess ? data.data : undefined;
  const rows = pageData?.data ?? [];
  const totalCount = pageData?.totalCount ?? 0;

  const openUser = (user: TAiCompanyUserSubscriptionResponse) => {
    setSelectedUserId(user.userId);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUserId(null);
  };

  if (isPermissionsLoading) {
    return (
      <div className="p-6">
        <AppFormPage title={t("ai.subscriptions.title")}>
          <AppFormSection>
            <p className={`${DesignTokens.typography.muted}`}>
              {t("common.loading")}
            </p>
          </AppFormSection>
        </AppFormPage>
      </div>
    );
  }

  if (!canGet) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return (
    <div className="p-4 sm:p-6">
      <AppFormPage title={t("ai.subscriptions.title")} className="gap-4!">
        <AppFormSection className="gap-4!">
          <p className={`m-0 ${DesignTokens.typography.muted}`}>
            {t("ai.subscriptions.description")}
          </p>

          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <Input
              allowClear
              value={listState.searchInput}
              onChange={(event) => listState.setSearchInput(event.target.value)}
              placeholder={t("ai.subscriptions.searchPlaceholder")}
              aria-label={t("ai.subscriptions.searchPlaceholder")}
              className="w-full! lg:max-w-xs!"
            />

            <Select
              value={listState.isManager}
              onChange={(value: TriState) => listState.setIsManager(value)}
              options={[
                {
                  value: "all",
                  label: t("ai.subscriptions.filters.managerAll"),
                },
                {
                  value: "true",
                  label: t("ai.subscriptions.filters.managers"),
                },
                {
                  value: "false",
                  label: t("ai.subscriptions.filters.nonManagers"),
                },
              ]}
              aria-label={t("ai.subscriptions.filters.manager")}
              className="w-full! lg:w-44!"
            />
          </div>

          {isError ? (
            <div className="flex flex-col gap-3">
              <AppErrorContainer
                error={data?.message ?? t("ai.subscriptions.loadError")}
              />
              <AppButton
                variant="secondary"
                loading={isFetching}
                onClick={() => {
                  void refetch();
                }}
                className="w-fit!"
              >
                {t("ai.subscriptions.retry")}
              </AppButton>
            </div>
          ) : (
            <AiSubscriptionTable
              rows={rows}
              loading={isPending || isFetching}
              page={listState.page}
              pageSize={listState.pageSize}
              totalCount={totalCount}
              onPageChange={(nextPage, nextPageSize) => {
                listState.setPage(nextPage);
                listState.setPageSize(nextPageSize);
              }}
              onOpenUser={openUser}
            />
          )}
        </AppFormSection>
      </AppFormPage>

      <AiSubscriptionDrawer
        open={isDrawerOpen}
        userId={selectedUserId}
        canUpdate={canUpdate}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default AiSubscriptionManagementPage;
