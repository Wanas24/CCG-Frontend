import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const ProjectCardSkeleton = () => (
  <div className="min-h-44 min-w-0 overflow-hidden rounded-2xl border border-(--Grey300) bg-(--Grey100) p-4">
    <AppSkeleton.Input active className="!mb-3 !h-5 !w-32 !min-w-32" />
    <AppSkeleton.Input active block className="!mb-2 !h-4 !w-full !min-w-0" />
    <AppSkeleton.Input active className="!mb-4 !h-4 !w-2/3 !min-w-24" />
    <div className="flex flex-wrap gap-2">
      <AppSkeleton.Button active size="small" className="!h-6 !w-16 !min-w-16" />
      <AppSkeleton.Button active size="small" className="!h-6 !w-20 !min-w-20" />
      <AppSkeleton.Button active size="small" className="!h-6 !w-16 !min-w-16" />
    </div>
  </div>
);

const ProjectsListSkeleton = () => (
  <div
    className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
    aria-busy="true"
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <ProjectCardSkeleton key={index} />
    ))}
  </div>
);

export default ProjectsListSkeleton;
