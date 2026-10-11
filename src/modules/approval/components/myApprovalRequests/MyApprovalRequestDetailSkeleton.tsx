import { useTranslation } from "react-i18next";
import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const DiffRowSkeleton = () => (
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr_1.75rem_1fr] sm:items-stretch">
    <AppSkeleton.Input active className="!h-4 !w-24 !min-w-24 self-center" />
    <AppSkeleton.Input active className="!h-9 !w-full !min-w-0" />
    <div className="hidden sm:block" />
    <AppSkeleton.Input active className="!h-9 !w-full !min-w-0" />
  </div>
);

const MyApprovalRequestDetailSkeleton = () => {
  const { t } = useTranslation();

  return (
    <section
      className="min-h-[20rem] rounded-2xl border border-(--Grey300) bg-(--app-surface) p-5"
      aria-busy="true"
      aria-label={t("approval.myRequests.loading")}
    >
      <div className="mb-3.5 flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <AppSkeleton.Input active className="!h-6 !w-48 !min-w-48" />
          <AppSkeleton.Input active className="mt-2 !h-4 !w-56 !min-w-56" />
        </div>
        <div className="flex flex-wrap gap-2">
          <AppSkeleton.Button
            active
            className="!h-5 !w-14 !min-w-14 !rounded-full"
          />
          <AppSkeleton.Button
            active
            className="!h-5 !w-16 !min-w-16 !rounded-full"
          />
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <AppSkeleton.Button
          active
          className="!h-7 !w-28 !min-w-28 !rounded-full"
        />
        <AppSkeleton.Button
          active
          className="!h-7 !w-32 !min-w-32 !rounded-full"
        />
        <AppSkeleton.Button
          active
          className="!h-7 !w-24 !min-w-24 !rounded-full"
        />
        <AppSkeleton.Button
          active
          className="!h-7 !w-28 !min-w-28 !rounded-full"
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-hidden pb-1">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="min-w-[8.75rem] rounded-xl border border-(--Grey300) bg-(--Grey100) px-3 py-2.5"
          >
            <AppSkeleton.Input active className="!h-3 !w-14 !min-w-14" />
            <AppSkeleton.Input active className="mt-1.5 !h-4 !w-24 !min-w-24" />
            <AppSkeleton.Input active className="mt-1.5 !h-3 !w-16 !min-w-16" />
          </div>
        ))}
      </div>

      <div className="mb-3.5 rounded-xl border border-(--Grey300) bg-(--Grey100) px-3 py-2.5">
        <AppSkeleton.Input active className="!h-4 !w-64 !min-w-0 !max-w-full" />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2.5 rounded-xl border border-(--Grey300) bg-(--Primary100) px-3 py-2.5">
        <AppSkeleton.Input
          active
          className="!h-4 !min-w-0 !flex-1 !max-w-full"
        />
        <AppSkeleton.Button active className="!h-5 !w-28 !min-w-28" />
      </div>

      <div className="mb-1 hidden grid-cols-[10rem_1fr_1.75rem_1fr] gap-2 sm:grid">
        <AppSkeleton.Input active className="!h-3 !w-12 !min-w-12" />
        <AppSkeleton.Input active className="!h-3 !w-14 !min-w-14" />
        <span />
        <AppSkeleton.Input active className="!h-3 !w-12 !min-w-12" />
      </div>
      <div className="flex flex-col gap-2">
        <DiffRowSkeleton />
        <DiffRowSkeleton />
        <DiffRowSkeleton />
        <DiffRowSkeleton />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex items-start gap-2.5">
            <AppSkeleton.Avatar active size="small" className="!size-2" />
            <div className="min-w-0 flex-1">
              <AppSkeleton.Input active className="!h-4 !w-40 !min-w-40" />
              <AppSkeleton.Input active className="mt-1.5 !h-3 !w-52 !min-w-52" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyApprovalRequestDetailSkeleton;
