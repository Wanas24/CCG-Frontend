import {
  AppFormPage,
  AppFormSection,
  AppIdentitySplit,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";

import { DesignTokens } from "@/AntdTheme/DesignTokens";

const FieldSkeleton = ({ tall = false }: { tall?: boolean }) => (
  <div className="flex flex-col gap-1">
    <AppSkeleton.Input
      active
      size="small"
      className="!h-5 !w-24 !min-w-24"
    />
    <AppSkeleton.Input
      active
      block
      className={`!w-full !min-w-0 ${tall ? "!h-20" : "!h-10"}`}
    />
  </div>
);

const InfoRowSkeleton = () => (
  <div className="flex items-center justify-between gap-3 py-2">
    <AppSkeleton.Input
      active
      size="small"
      className="!h-4 !w-20 !min-w-20"
    />
    <AppSkeleton.Input
      active
      size="small"
      className="!h-4 !w-28 !min-w-28"
    />
  </div>
);

const CompanyPageSkeleton = () => {
  return (
    <div className="p-6">
      <AppFormPage
        title={
          <AppSkeleton.Input
            active
            size="small"
            className="!h-6 !w-24 !min-w-24"
          />
        }
      >
        <AppIdentitySplit
          sidebar={
            <>
              <AppFormSection>
                <div className="flex flex-col items-center gap-4">
                  <AppSkeleton.Avatar
                    active
                    size={DesignTokens.media.avatarLgPx}
                  />

                  <AppSkeleton.Input
                    active
                    className="!h-5 !w-40 !min-w-40"
                  />

                  <div className="flex w-full flex-wrap items-center justify-center gap-2">
                    <AppSkeleton.Button
                      active
                      className="!h-10"
                    />

                    <AppSkeleton.Button
                      active
                      className="!h-10"
                    />
                  </div>
                </div>
              </AppFormSection>

              <AppFormSection>
                <AppSkeleton.Input
                  active
                  size="small"
                  className="!h-6 !w-32 !min-w-32"
                />

                <div className="flex flex-col divide-y divide-(--Grey300)">
                  <InfoRowSkeleton />
                  <InfoRowSkeleton />
                  <InfoRowSkeleton />
                </div>
              </AppFormSection>
            </>
          }
        >
          <AppFormSection>
            <AppSkeleton.Input
              active
              size="small"
              className="!h-6 !w-48 !min-w-48"
            />

            <div className="flex flex-col gap-6">
              <FieldSkeleton />
              <FieldSkeleton tall />
              <FieldSkeleton />
              <FieldSkeleton />

              <AppSkeleton.Button
                active
                className="!h-11 !w-full sm:!w-36"
              />
            </div>
          </AppFormSection>

          <AppFormSection>
            <AppSkeleton.Input
              active
              size="small"
              className="!h-6 !w-36 !min-w-36"
            />

            <AppSkeleton.Button active className="!h-10 !w-36" />
          </AppFormSection>
        </AppIdentitySplit>
      </AppFormPage>
    </div>
  );
};

export default CompanyPageSkeleton;