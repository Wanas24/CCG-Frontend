import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const FileRowSkeleton = () => (
  <div className="flex items-center gap-2 rounded-xl border border-(--Grey300) bg-(--Grey100) p-2.5">
    <AppSkeleton.Avatar active size={36} shape="square" />
    <div className="min-w-0 flex-1">
      <AppSkeleton.Input active className="!mb-1 !h-4 !w-36 !min-w-24" />
      <AppSkeleton.Input active className="!h-3 !w-16 !min-w-16" />
    </div>
    <AppSkeleton.Button active size="small" className="!size-8 !min-w-8" />
    <AppSkeleton.Button active size="small" className="!size-8 !min-w-8" />
  </div>
);

const ItemCatalogFilesSkeleton = () => (
  <div className="flex flex-col gap-2" aria-busy="true">
    {Array.from({ length: 3 }).map((_, index) => (
      <FileRowSkeleton key={index} />
    ))}
  </div>
);

export default ItemCatalogFilesSkeleton;
