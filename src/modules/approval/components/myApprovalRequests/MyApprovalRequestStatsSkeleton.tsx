import { useTranslation } from "react-i18next";
import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const STAT_COUNT = 5;

const MyApprovalRequestStatsSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div
      className="grid grid-cols-2 gap-3 lg:grid-cols-5"
      aria-busy="true"
      aria-label={t("approval.myRequests.loading")}
    >
      {Array.from({ length: STAT_COUNT }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-(--Grey300) bg-(--app-surface) px-4 py-3.5"
        >
          <AppSkeleton.Input active className="!h-3 !w-16 !min-w-16" />
          <AppSkeleton.Input active className="mt-2 !h-8 !w-12 !min-w-12" />
        </div>
      ))}
    </div>
  );
};

export default MyApprovalRequestStatsSkeleton;
