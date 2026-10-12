import { AppSkeleton } from "@/shared/ANTD_UIComponents";

type Props = {
  viewMode: "board" | "timeline";
};

const AlertCardSkeleton = () => (
  <div className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-3.5">
    <div className="mb-3 flex items-start justify-between gap-2">
      <AppSkeleton.Input active className="!h-5 !w-32 !min-w-32" />
      <AppSkeleton.Button active size="small" className="!h-6 !w-16 !min-w-16" />
    </div>
    <AppSkeleton.Input active block className="!mb-2 !h-4 !w-full !min-w-0" />
    <AppSkeleton.Input active className="!mb-3 !h-4 !w-2/3 !min-w-24" />
    <div className="flex gap-2">
      <AppSkeleton.Button active size="small" className="!h-8 !w-16 !min-w-16" />
      <AppSkeleton.Button active size="small" className="!h-8 !w-16 !min-w-16" />
    </div>
  </div>
);

const AlertsContentSkeleton = ({ viewMode }: Props) => {
  if (viewMode === "timeline") {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        <AppSkeleton.Input active className="!h-4 !w-24 !min-w-24" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <AlertCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-3.5 overflow-x-auto pb-1"
      aria-busy="true"
    >
      {Array.from({ length: 4 }).map((_, laneIndex) => (
        <section
          key={laneIndex}
          className="min-h-[220px] rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3"
        >
          <div className="mb-3 flex items-center gap-2">
            <AppSkeleton.Avatar active size="small" />
            <AppSkeleton.Input active className="!h-4 !w-20 !min-w-20" />
            <AppSkeleton.Button
              active
              size="small"
              className="!h-5 !w-8 !min-w-8"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 2 }).map((_, cardIndex) => (
              <AlertCardSkeleton key={cardIndex} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AlertsContentSkeleton;
