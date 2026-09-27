import {
  AppFormFields,
  AppFormPage,
  AppFormSection,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";

const FieldSkeleton = ({ tall = false }: { tall?: boolean }) => (
  <div className="flex flex-col gap-2">
    <AppSkeleton.Input active size="small" className="!w-24 !min-w-24" />
    <AppSkeleton.Input
      active
      block
      className={`!w-full !min-w-0 ${tall ? "!h-20" : "!h-10"}`}
    />
  </div>
);

const ProfilePageSkeleton = () => {
  return (
    <div className="p-6">
      <AppFormPage
        title={<AppSkeleton.Input active size="small" className="!w-28 !min-w-28" />}
      >
        <div className="flex flex-col gap-6">
          <AppFormSection>
            <AppSkeleton.Input active size="small" className="!w-32 !min-w-32" />
            <div className="flex flex-col gap-4">
              <AppSkeleton.Avatar active size={112} />
              <AppSkeleton.Input active block className="!h-24 !w-full" />
              <AppSkeleton.Button active className="!h-10 !w-36" />
            </div>
          </AppFormSection>

          <AppFormSection>
            <AppSkeleton.Input active size="small" className="!w-36 !min-w-36" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
          </AppFormSection>

          <AppFormSection>
            <AppSkeleton.Input active size="small" className="!w-44 !min-w-44" />
            <div className="flex flex-col gap-5">
              <AppFormFields>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FieldSkeleton />
                  <FieldSkeleton />
                </div>
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton tall />
              </AppFormFields>
              <AppSkeleton.Button active className="!h-10 !w-36" />
            </div>
          </AppFormSection>

          <AppFormSection>
            <AppSkeleton.Input active size="small" className="!w-32 !min-w-32" />
            <AppSkeleton.Input active size="small" className="!w-80 !max-w-full" />
            <div className="flex flex-col gap-5">
              <AppFormFields>
                <FieldSkeleton />
              </AppFormFields>
              <AppSkeleton.Button active className="!h-10 !w-48" />
            </div>
          </AppFormSection>
        </div>
      </AppFormPage>
    </div>
  );
};

export default ProfilePageSkeleton;
