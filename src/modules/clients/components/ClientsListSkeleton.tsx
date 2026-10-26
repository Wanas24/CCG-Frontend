import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const ClientCardSkeleton = () => (
  <div className="min-h-28 min-w-0 overflow-hidden rounded-2xl border border-(--Grey300) bg-(--Grey100) p-4">
    <AppSkeleton.Input active className="!mb-3 !h-5 !w-32 !min-w-32" />
    <AppSkeleton.Input active className="!h-4 !w-20 !min-w-20" />
  </div>
);

const ClientsListSkeleton = () => (
  <div
    className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
    aria-busy="true"
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <ClientCardSkeleton key={index} />
    ))}
  </div>
);

export default ClientsListSkeleton;
