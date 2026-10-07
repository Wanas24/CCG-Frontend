import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const UnitCardSkeleton = () => (
  <div className="min-h-28 min-w-0 overflow-hidden rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3">
    <AppSkeleton.Input active className="!mb-3 !h-5 !w-24 !min-w-24" />
    <AppSkeleton.Input active block className="!mb-2 !h-4 !w-full !min-w-0" />
    <div className="mt-3 flex gap-2">
      <AppSkeleton.Button active size="small" className="!h-8 !w-14 !min-w-14" />
      <AppSkeleton.Button active size="small" className="!h-8 !w-14 !min-w-14" />
    </div>
  </div>
);

const UnitsListSkeleton = () => (
  <div
    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    aria-busy="true"
  >
    {Array.from({ length: 12 }).map((_, index) => (
      <UnitCardSkeleton key={index} />
    ))}
  </div>
);

export default UnitsListSkeleton;
