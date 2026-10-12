import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const StatCardSkeleton = () => (
  <div className="rounded-xl border border-(--Grey300) bg-(--app-surface) p-4">
    <AppSkeleton.Input active className="!mb-2 !h-3 !w-24 !min-w-20" />
    <AppSkeleton.Input active className="!mb-2 !h-8 !w-16 !min-w-16" />
    <AppSkeleton.Input active className="!h-4 !w-32 !min-w-28" />
  </div>
);

const PanelSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <section className="rounded-2xl border border-(--Grey300) bg-(--app-surface)">
    <div className="flex items-center gap-2 border-b border-(--Grey300) px-[18px] py-3.5">
      <AppSkeleton.Input active className="!h-5 !w-28 !min-w-24" />
      <AppSkeleton.Button active size="small" className="!h-5 !w-8 !min-w-8" />
    </div>
    <div className="border-b border-(--Grey300) px-[18px] py-3">
      <AppSkeleton.Input active block className="!h-10 !w-full !min-w-0" />
    </div>
    <div className="flex flex-col gap-2.5 p-[18px]">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-(--Grey300) bg-(--Grey100) p-3"
        >
          <AppSkeleton.Input active className="!mb-2 !h-4 !w-36 !min-w-24" />
          <AppSkeleton.Input active block className="!h-3 !w-full !min-w-0" />
        </div>
      ))}
    </div>
  </section>
);

const UserControlPageSkeleton = () => (
  <div className="flex flex-col gap-[18px]" aria-busy="true">
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>

    <div className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4">
      <AppSkeleton.Input active className="!mb-3 !h-5 !w-40 !min-w-32" />
      <div className="flex flex-wrap gap-2">
        <AppSkeleton.Button active className="!h-9 !w-28" />
        <AppSkeleton.Button active className="!h-9 !w-28" />
        <AppSkeleton.Button active className="!h-9 !w-36" />
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <AppSkeleton.Button active className="!h-10 !w-56 !rounded-xl" />
      <AppSkeleton.Button active className="!h-10 !w-28" />
    </div>

    <div className="grid grid-cols-1 gap-4 min-[1251px]:grid-cols-[minmax(260px,320px)_minmax(0,1fr)_minmax(260px,340px)]">
      <PanelSkeleton rows={4} />
      <section className="rounded-2xl border border-(--Grey300) bg-(--app-surface)">
        <div className="flex items-center gap-2 border-b border-(--Grey300) px-[18px] py-3.5">
          <AppSkeleton.Input active className="!h-5 !w-24 !min-w-20" />
          <AppSkeleton.Button active size="small" className="!h-5 !w-8 !min-w-8" />
        </div>
        <div className="border-b border-(--Grey300) px-[18px] py-3">
          <AppSkeleton.Input active block className="!h-10 !w-full !min-w-0" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3.5 p-[18px]">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[190px] rounded-2xl border border-(--Grey300) bg-(--Grey100) p-4"
            >
              <AppSkeleton.Input active className="!mb-3 !h-5 !w-28 !min-w-24" />
              <AppSkeleton.Input active block className="!mb-2 !h-3 !w-full !min-w-0" />
              <AppSkeleton.Input active className="!h-3 !w-2/3 !min-w-20" />
            </div>
          ))}
        </div>
      </section>
      <PanelSkeleton rows={5} />
    </div>
  </div>
);

export default UserControlPageSkeleton;
