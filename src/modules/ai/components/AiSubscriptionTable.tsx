import { useTranslation } from "react-i18next";
import { Table, type TableColumnsType, type TablePaginationConfig } from "antd";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useLocale } from "@/i18n";
import type { TAiCompanyUserSubscriptionResponse } from "../types";
import { formatAiSubscriptionDate } from "../utils/aiSubscriptionDates";
import { formatAiUsageNumber } from "../utils/aiUsageFormat";

type Props = {
  rows: TAiCompanyUserSubscriptionResponse[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number, pageSize: number) => void;
  onOpenUser: (user: TAiCompanyUserSubscriptionResponse) => void;
};

const AiSubscriptionTable = ({
  rows,
  loading,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onOpenUser,
}: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const columns: TableColumnsType<TAiCompanyUserSubscriptionResponse> = [
    {
      title: t("ai.subscriptions.columns.user"),
      key: "user",
      render: (_, row) => (
        <p className="m-0 font-medium text-(--app-text)">
          {row.firstName} {row.lastName}
        </p>
      ),
    },
    {
      title: t("ai.subscriptions.columns.email"),
      key: "email",
      render: (_, row) => (
        <p dir="ltr" className="m-0 truncate text-(--app-text)">
          {row.email}
        </p>
      ),
    },
    {
      title: t("ai.subscriptions.columns.role"),
      key: "role",
      width: 120,
      render: (_, row) =>
        row.isManager
          ? t("ai.subscriptions.role.manager")
          : t("ai.subscriptions.role.employee"),
    },
    {
      title: t("ai.subscriptions.columns.subscription"),
      key: "subscription",
      width: 150,
      render: (_, row) => {
        if (!row.isSubscribed) {
          return t("ai.subscriptions.notSubscribed");
        }

        if (row.hasUnlimitedUsage) {
          return (
            <div>
              <p className="m-0">{t("ai.subscriptions.subscribed")}</p>
              <p className="m-0 text-xs text-(--Grey600)">
                {t("ai.subscriptions.unlimited")}
              </p>
            </div>
          );
        }

        return t("ai.subscriptions.subscribed");
      },
    },
    {
      title: t("ai.subscriptions.columns.renewalDate"),
      key: "renewalDate",
      width: 140,
      render: (_, row) => {
        const renewalDate = formatAiSubscriptionDate(
          row.subscribedToUtc,
          locale,
        );
        return renewalDate ?? t("ai.subscriptions.emptyValue");
      },
    },
    {
      title: t("ai.subscriptions.columns.usage"),
      key: "usage",
      width: 180,
      render: (_, row) => {
        if (!row.isSubscribed) {
          return t("ai.subscriptions.emptyValue");
        }

        if (row.hasUnlimitedUsage) {
          return t("ai.subscriptions.unlimited");
        }

        const usedTokens = row.usedTokens ?? 0;
        const usedMessages = row.usedMessages ?? 0;

        return (
          <div dir="ltr" className="text-xs text-(--Grey700)">
            <p className="m-0">
              {formatAiUsageNumber(usedTokens, locale)} /{" "}
              {formatAiUsageNumber(row.monthlyTokenLimit, locale)}{" "}
              {t("ai.subscriptions.tokensShort")}
            </p>
            <p className="m-0">
              {formatAiUsageNumber(usedMessages, locale)} /{" "}
              {formatAiUsageNumber(row.monthlyMessageLimit, locale)}{" "}
              {t("ai.subscriptions.messagesShort")}
            </p>
          </div>
        );
      },
    },
    {
      title: t("ai.subscriptions.columns.actions"),
      key: "actions",
      width: 110,
      fixed: "right",
      render: (_, row) => (
        <AppButton
          variant="tertiary"
          onClick={() => onOpenUser(row)}
          className="px-0!"
        >
          {t("ai.subscriptions.viewEdit")}
        </AppButton>
      ),
    },
  ];

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total: totalCount,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    onChange: onPageChange,
    showTotal: (total, range) =>
      t("ai.subscriptions.paginationTotal", {
        from: range[0],
        to: range[1],
        total,
      }),
  };

  return (
    <Table<TAiCompanyUserSubscriptionResponse>
      rowKey="userId"
      columns={columns}
      dataSource={rows}
      loading={loading}
      pagination={pagination}
      scroll={{ x: 960 }}
      locale={{ emptyText: t("ai.subscriptions.empty") }}
      className="overflow-hidden rounded-xl border border-(--Grey300) bg-(--app-surface)"
    />
  );
};

export default AiSubscriptionTable;
