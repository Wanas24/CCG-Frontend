import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppDrawer } from "@/shared/ANTD_UIComponents";
import type { ProjectFormValues } from "../schemas/projectFormSchema";
import ProjectFormFields from "./ProjectFormFields";

type Props = {
  open: boolean;
  form: UseFormReturn<ProjectFormValues>;
  clientLabel?: string;
  loading?: boolean;
  onClientLabelChange: (label?: string) => void;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
};

const CreateProjectDrawer = ({
  open,
  form,
  clientLabel,
  loading,
  onClientLabelChange,
  onSubmit,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={640}
      title={t("projects.form.createTitle")}
      destroyOnHidden
      footer={
        <div className="flex justify-end gap-2">
          <AppButton
            variant="secondary"
            htmlType="button"
            disabled={loading}
            onClick={onClose}
          >
            {t("projects.form.cancel")}
          </AppButton>
          <AppButton
            htmlType="submit"
            form="create-project-form"
            loading={loading}
          >
            {t("projects.form.create")}
          </AppButton>
        </div>
      }
    >
      <p className={`m-0 mb-4 ${DesignTokens.typography.muted}`}>
        {t("projects.form.createSubtitle")}
      </p>
      <form id="create-project-form" onSubmit={onSubmit} noValidate>
        <ProjectFormFields
          control={form.control}
          disabled={loading}
          selectedClientLabel={clientLabel}
          onClientLabelChange={onClientLabelChange}
        />
      </form>
    </AppDrawer>
  );
};

export default CreateProjectDrawer;
