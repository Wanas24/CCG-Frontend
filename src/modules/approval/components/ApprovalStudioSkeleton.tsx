import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const StatCardSkeleton = () => (
  <div className="relative h-fit overflow-hidden rounded-xl border border-(--Grey300) bg-(--app-surface) p-4 shadow-xl">
    <AppSkeleton.Input active className="!mb-2 !h-3 !w-20 !min-w-20" />
    <AppSkeleton.Input active className="!mb-2 !h-8 !w-16 !min-w-16" />
    <AppSkeleton.Input active className="!h-4 !w-28 !min-w-28" />
  </div>
);

const WorkflowCardSkeleton = () => (
  <div className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4">
    <div className="mb-3 flex items-center justify-between gap-2">
      <AppSkeleton.Input active className="!h-5 !w-40 !min-w-32" />
      <AppSkeleton.Button active size="small" className="!h-6 !w-16 !min-w-16" />
    </div>
    <AppSkeleton.Input active block className="!mb-2 !h-4 !w-full !min-w-0" />
    <AppSkeleton.Input active className="!mb-3 !h-4 !w-2/3 !min-w-24" />
    <div className="flex gap-2">
      <AppSkeleton.Button active size="small" className="!h-7 !w-20 !min-w-20" />
      <AppSkeleton.Button active size="small" className="!h-7 !w-20 !min-w-20" />
    </div>
  </div>
);

const ApprovalStudioSkeleton = () => (
  <div className="flex flex-col gap-[18px]" aria-busy="true">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <AppSkeleton.Input active className="!h-7 !w-48 !min-w-40" />
        <AppSkeleton.Input active className="!mt-2 !h-4 !w-72 !min-w-48" />
      </div>
      <AppSkeleton.Button active className="!h-10 !w-28" />
    </header>

    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <AppSkeleton.Button active className="!h-10 !w-52 !rounded-xl" />
      <AppSkeleton.Input active className="!h-10 !min-w-0 flex-1" />
      <AppSkeleton.Button active className="!h-8 !w-28" />
      <AppSkeleton.Button active className="!h-10 !w-36" />
    </div>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[240px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-3">
        <AppSkeleton.Input active className="!mb-3 !h-4 !w-24 !min-w-24" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <AppSkeleton.Button
              key={index}
              active
              block
              className="!h-9 !w-full !min-w-0"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <WorkflowCardSkeleton key={index} />
        ))}
      </div>
    </div>
  </div>
);

export default ApprovalStudioSkeleton;
