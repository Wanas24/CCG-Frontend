import { AppSkeleton } from "@/shared/ANTD_UIComponents";

export const EmployeeListSkeleton = () => (
  <div className="flex flex-col gap-2.5" aria-busy="true">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 rounded-xl border border-(--Grey300) bg-(--Grey100) p-3"
      >
        <AppSkeleton.Avatar active size="large" />
        <div className="min-w-0 flex-1">
          <AppSkeleton.Input active className="!mb-1 !h-4 !w-32 !min-w-24" />
          <AppSkeleton.Input active className="!h-3 !w-24 !min-w-20" />
        </div>
        <AppSkeleton.Button active size="small" className="!h-6 !w-20 !min-w-20" />
      </div>
    ))}
  </div>
);

export const RoleCardsSkeleton = () => (
  <div
    className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3.5"
    aria-busy="true"
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="min-h-[190px] rounded-2xl border border-(--Grey300) bg-(--Grey100) p-4"
      >
        <AppSkeleton.Input active className="!mb-3 !h-5 !w-28 !min-w-24" />
        <AppSkeleton.Input active block className="!mb-2 !h-3 !w-full !min-w-0" />
        <AppSkeleton.Input active className="!mb-4 !h-3 !w-2/3 !min-w-20" />
        <div className="mt-auto flex flex-wrap gap-1.5">
          <AppSkeleton.Button active size="small" className="!h-6 !w-16 !min-w-16" />
          <AppSkeleton.Button active size="small" className="!h-6 !w-16 !min-w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const CatalogGroupsSkeleton = () => (
  <div className="flex flex-col gap-3" aria-busy="true">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="rounded-xl border border-(--Grey300) bg-(--Grey100) p-3"
      >
        <AppSkeleton.Input active className="!mb-3 !h-4 !w-36 !min-w-28" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 5 }).map((_, chipIndex) => (
            <AppSkeleton.Button
              key={chipIndex}
              active
              size="small"
              className="!h-7 !w-20 !min-w-16"
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const CoverageMatrixSkeleton = () => (
  <section
    className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-[18px]"
    aria-busy="true"
  >
    <div className="mb-4 flex items-center gap-2">
      <AppSkeleton.Input active className="!h-5 !w-36 !min-w-28" />
      <AppSkeleton.Input active className="!h-4 !w-48 !min-w-32" />
    </div>
    <div className="overflow-auto">
      <div className="grid min-w-[520px] grid-cols-6 gap-1.5">
        {Array.from({ length: 30 }).map((_, index) => (
          <AppSkeleton.Button
            key={index}
            active
            className="!h-9 !w-full !min-w-0"
          />
        ))}
      </div>
    </div>
  </section>
);

export const AccessMapSkeleton = () => (
  <section
    className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-[18px]"
    aria-busy="true"
  >
    <div className="mb-4 flex items-center gap-2">
      <AppSkeleton.Input active className="!h-5 !w-32 !min-w-28" />
      <AppSkeleton.Input active className="!h-4 !w-40 !min-w-32" />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-2">
          <AppSkeleton.Input active className="!mb-1 !h-4 !w-24 !min-w-20" />
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="rounded-xl border border-(--Grey300) bg-(--Grey100) px-3 py-2.5"
            >
              <AppSkeleton.Input active className="!h-4 !w-28 !min-w-20" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </section>
);
