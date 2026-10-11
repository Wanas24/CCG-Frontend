import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppSkeleton } from "@/shared/ANTD_UIComponents";
import { MY_APPROVAL_REQUESTS_PAGE_SIZE } from "../../constants/myApprovalRequests";

const RequestCardSkeleton = () => (
  <div className="rounded-xl border border-(--Grey300) bg-(--Grey100) px-3.5 py-3">
    <div className="flex flex-wrap items-center gap-2">
      <AppSkeleton.Button active className="!h-5 !w-14 !min-w-14 !rounded-full" />
      <AppSkeleton.Button active className="!h-5 !w-16 !min-w-16 !rounded-full" />
      <AppSkeleton.Input
        active
        className="!h-4 !min-w-0 !flex-1 !max-w-[10rem]"
      />
    </div>
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <AppSkeleton.Input active className="!h-3.5 !w-24 !min-w-24" />
      <AppSkeleton.Input active className="!h-3.5 !w-28 !min-w-28" />
      <AppSkeleton.Input
        active
        className="!h-3.5 !w-20 !min-w-20 ms-auto"
      />
    </div>
    <AppSkeleton.Input active className="mt-2 !h-3.5 !w-40 !min-w-40" />
  </div>
);

const MyApprovalRequestListSkeleton = () => {
  const { t } = useTranslation();

  return (
    <section
      className="flex min-h-[20rem] flex-col rounded-2xl border border-(--Grey300) bg-(--app-surface)"
      aria-busy="true"
      aria-label={t("approval.myRequests.loading")}
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <h2 className={clsx(DesignTokens.typography.emphasis, "m-0 text-sm!")}>
          {t("approval.myRequests.listTitle")}
        </h2>
        <AppSkeleton.Button
          active
          className="!h-5 !w-8 !min-w-8 !rounded-full"
        />
      </div>

      <div className="flex max-h-[min(32rem,calc(100dvh-22rem))] flex-col gap-2.5 overflow-auto px-3 pb-3 lg:max-h-[calc(100dvh-22rem)]">
        {Array.from({ length: MY_APPROVAL_REQUESTS_PAGE_SIZE }, (_, index) => (
          <RequestCardSkeleton key={index} />
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-(--Grey300) px-3.5 py-3">
        <AppSkeleton.Input
          active
          className="!h-3.5 !w-28 !min-w-28 me-auto"
        />
        <AppSkeleton.Button active className="!h-8 !w-20 !min-w-20" />
        <AppSkeleton.Button active className="!h-8 !w-16 !min-w-16" />
      </div>
    </section>
  );
};

export default MyApprovalRequestListSkeleton;
