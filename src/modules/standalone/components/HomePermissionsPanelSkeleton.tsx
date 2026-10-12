import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const HomePermissionsPanelSkeleton = () => (
  <div className="flex flex-col gap-4" aria-busy="true">
    <div className="flex flex-wrap gap-2">
      <AppSkeleton.Button active className="!h-7 !w-28 !min-w-28" />
      <AppSkeleton.Button active className="!h-7 !w-32 !min-w-28" />
    </div>

    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section
          key={sectionIndex}
          className="rounded-xl border border-(--Grey300) bg-(--app-surface) p-4"
        >
          <AppSkeleton.Input active className="!mb-3 !h-5 !w-32 !min-w-28" />
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <li
                key={rowIndex}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-(--Grey300) pb-2 last:border-b-0 last:pb-0"
              >
                <AppSkeleton.Input
                  active
                  className="!h-4 !w-40 !min-w-28"
                />
                <AppSkeleton.Button
                  active
                  size="small"
                  className="!h-6 !w-20 !min-w-16"
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </div>
);

export default HomePermissionsPanelSkeleton;
