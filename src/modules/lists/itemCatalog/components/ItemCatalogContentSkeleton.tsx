import { AppSkeleton } from "@/shared/ANTD_UIComponents";

const LegendChipSkeleton = () => (
  <AppSkeleton.Button active className="!h-9 !w-28 !min-w-28 !rounded-full" />
);

const ItemCardSkeleton = () => (
  <div className="min-h-24 rounded-2xl border border-(--Grey300) bg-(--app-surface) p-3">
    <AppSkeleton.Input active className="!mb-2 !h-4 !w-28 !min-w-28" />
    <AppSkeleton.Input active block className="!h-3 !w-full !min-w-0" />
  </div>
);

type Props = {
  showLegend?: boolean;
};

const ItemCatalogContentSkeleton = ({ showLegend = true }: Props) => (
  <div className="flex flex-col gap-3" aria-busy="true">
    {showLegend ? (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <LegendChipSkeleton key={index} />
        ))}
      </div>
    ) : null}

    <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-2 lg:overflow-x-visible lg:pb-0">
      <div className="flex w-max min-w-full gap-3 lg:grid lg:w-full lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, laneIndex) => (
          <section
            key={laneIndex}
            className="flex w-[min(16.5rem,78vw)] shrink-0 flex-col overflow-hidden rounded-2xl border border-(--Grey300) bg-(--Grey100) lg:w-auto lg:min-w-0"
          >
            <header className="flex items-center gap-2 p-2.5 sm:p-3">
              <AppSkeleton.Avatar active size="small" shape="square" />
              <div className="min-w-0 flex-1">
                <AppSkeleton.Input active className="!h-4 !w-24 !min-w-24" />
                <AppSkeleton.Input
                  active
                  className="!mt-1 !h-3 !w-16 !min-w-16"
                />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-2 px-2 pb-2.5 sm:px-2.5 sm:pb-3">
              {Array.from({ length: 2 }).map((_, cardIndex) => (
                <ItemCardSkeleton key={cardIndex} />
              ))}
              <AppSkeleton.Button
                active
                block
                className="!mt-auto !h-12 !w-full !min-w-0 !rounded-2xl"
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  </div>
);

export default ItemCatalogContentSkeleton;
