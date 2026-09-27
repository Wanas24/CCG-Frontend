import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import { useDeleteCompanyManager } from "../hooks/useDeleteCompanyManager";

const CompanyDeleteSection = () => {
  const { t } = useTranslation();
  const { deleteCompany, isPending } = useDeleteCompanyManager();
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    if (isPending) {
      return;
    }

    setOpen(false);
  };

  const onConfirm = async () => {
    const deleted = await deleteCompany();

    if (deleted) {
      setOpen(false);
    }
  };

  return (
    <>
      <AppButton
        variant="delete"
        loading={isPending}
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        {t("company.delete.action")}
      </AppButton>

      <AppDialog
        open={open}
        title={t("company.delete.confirmTitle")}
        onCancel={closeDialog}
        footer={
          <div className="flex justify-end gap-2">
            <AppButton
              variant="tertiary"
              disabled={isPending}
              onClick={closeDialog}
            >
              {t("common.cancel")}
            </AppButton>
            <AppButton
              variant="delete"
              loading={isPending}
              disabled={isPending}
              onClick={() => void onConfirm()}
            >
              {t("company.delete.action")}
            </AppButton>
          </div>
        }
      >
        <p className="text-sm text-(--app-text)">
          {t("company.delete.confirmMessage")}
        </p>
      </AppDialog>
    </>
  );
};

export default CompanyDeleteSection;
