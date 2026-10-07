import { useState } from "react";
import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import type { ReportLayoutStudioApi } from "../hooks/useReportLayoutStudio";

type Props = {
  studio: ReportLayoutStudioApi;
};

const ReportLayoutDialogs = ({ studio }: Props) => {
  const { t } = useTranslation();
  const [code, setCode] = useState(studio.saveDraft?.code ?? "");
  const [name, setName] = useState(studio.saveDraft?.name ?? "");
  const [isDefault, setIsDefault] = useState(studio.saveDraft?.isDefault ?? false);

  return (
    <>
      <AppDialog
        open={studio.saveDraft !== null}
        title={t("reportLayout.save.title")}
        onCancel={studio.closeSave}
        destroyOnHidden
        afterOpenChange={(open) => {
          if (!open || !studio.saveDraft) return;
          setCode(studio.saveDraft.code);
          setName(studio.saveDraft.name);
          setIsDefault(studio.saveDraft.isDefault);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <AppButton variant="secondary" onClick={studio.closeSave}>
              {t("reportLayout.save.cancel")}
            </AppButton>
            <AppButton
              loading={studio.isSaving}
              onClick={() => studio.submitSave({ code, name, isDefault })}
            >
              {t("reportLayout.save.submit")}
            </AppButton>
          </div>
        }
      >
        <p className="mb-4 text-sm text-(--Grey600)">{t("reportLayout.save.hint")}</p>
        <label className="mb-3 block text-sm font-semibold">
          {t("reportLayout.save.code")}
          <input
            className="mt-1 w-full rounded-[10px] border border-(--Grey300) bg-(--Grey100) px-2.5 py-2 outline-none focus:border-(--Primary400)"
            maxLength={100}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </label>
        <label className="mb-3 block text-sm font-semibold">
          {t("reportLayout.save.name")}
          <input
            className="mt-1 w-full rounded-[10px] border border-(--Grey300) bg-(--Grey100) px-2.5 py-2 outline-none focus:border-(--Primary400)"
            maxLength={250}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <Switch size="small" checked={isDefault} onChange={setIsDefault} />
          {t("reportLayout.save.makeDefault")}
        </label>
      </AppDialog>

      <AppDialog
        open={studio.confirm !== null}
        title={studio.confirm?.title}
        onCancel={studio.closeConfirm}
        footer={
          <div className="flex justify-end gap-2">
            <AppButton variant="secondary" onClick={studio.closeConfirm}>
              {t("reportLayout.confirm.cancel")}
            </AppButton>
            <AppButton
              variant={studio.confirm?.danger ? "delete" : "primary"}
              className="h-10! w-fit!"
              loading={studio.isSaving}
              onClick={studio.acceptConfirm}
            >
              {studio.confirm?.confirmLabel}
            </AppButton>
          </div>
        }
      >
        <p className="text-sm text-(--Grey600)">{studio.confirm?.body}</p>
      </AppDialog>
    </>
  );
};

export default ReportLayoutDialogs;
