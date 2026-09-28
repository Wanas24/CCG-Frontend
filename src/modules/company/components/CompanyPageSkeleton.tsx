import {
  AppFormFields,
  AppFormPage,
  AppFormSection,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";

const FieldSkeleton = ({ tall = false }: { tall?: boolean }) => (
  <div className="flex flex-col gap-1">
    <AppSkeleton.Input active size="small" className="!h-5 !w-24 !min-w-24" />
    <AppSkeleton.Input
      active
      block
      className={`!w-full !min-w-0 ${tall ? "!h-20" : "!h-10"}`}
    />
  </div>
);

const SectionTitleSkeleton = ({ className }: { className: string }) => (
  <AppSkeleton.Input active size="small" className={`!h-6 ${className}`} />
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
        <div className="flex flex-col gap-6">
          <AppFormSection>
            <SectionTitleSkeleton className="!w-32 !min-w-32" />
            <div className="flex flex-col items-center gap-4 sm:flex-col sm:items-center">
              <AppSkeleton.Avatar active size={112} />
              <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:flex-row">
                <AppSkeleton.Button
                  active
                  className="!h-11 !w-full sm:!w-32"
                />
                <AppSkeleton.Button active className="!h-10 !w-28" />
              </div>
            </div>
          </AppFormSection>

          <AppFormSection>
            <SectionTitleSkeleton className="!w-48 !min-w-48" />
            <div className="flex flex-col gap-6">
              <AppFormFields>
                <FieldSkeleton />
                <FieldSkeleton tall />
                <FieldSkeleton />
                <FieldSkeleton />
              </AppFormFields>
              <AppSkeleton.Button active className="!h-11 !w-full sm:!w-36" />
            </div>
          </AppFormSection>

          <AppFormSection>
            <SectionTitleSkeleton className="!w-36 !min-w-36" />
            <AppSkeleton.Button active className="!h-10 !w-36" />
          </AppFormSection>
        </div>
      </AppFormPage>
    </div>
  );
};

export default CompanyPageSkeleton;
