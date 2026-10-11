import {
  AppFormPage,
  AppFormSection,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";

const AiSubscriptionPageSkeleton = () => (
  <div className="p-6" aria-busy="true">
    <AppFormPage
      title={
        <AppSkeleton.Input active className="!h-6 !w-48 !min-w-40" />
      }
      className="gap-4!"
    >
      <AppFormSection className="gap-4!">
        <AppSkeleton.Input active className="!h-4 !w-80 !min-w-48" />

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <AppSkeleton.Input active className="!h-10 !w-full !min-w-0 lg:!max-w-xs" />
          <AppSkeleton.Input active className="!h-10 !w-full !min-w-0 lg:!w-44" />
        </div>

        <div className="overflow-hidden rounded-xl border border-(--Grey300)">
          <div className="grid grid-cols-4 gap-3 border-b border-(--Grey300) bg-(--Grey100) px-4 py-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <AppSkeleton.Input
                key={index}
                active
                className="!h-4 !w-20 !min-w-16"
              />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-4 gap-3 border-b border-(--Grey300) px-4 py-3 last:border-b-0"
            >
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <AppSkeleton.Input
                  key={colIndex}
                  active
                  className="!h-4 !w-24 !min-w-16"
                />
              ))}
            </div>
          ))}
        </div>
      </AppFormSection>
    </AppFormPage>
  </div>
);

export default AiSubscriptionPageSkeleton;
