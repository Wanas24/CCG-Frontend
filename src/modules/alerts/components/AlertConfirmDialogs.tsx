import { useTranslation } from "react-i18next";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import type { TAlert } from "../types";

export type AlertConfirmKind = "done" | "cancel" | "delete";

type Props = {
  kind: AlertConfirmKind | null;
  alert: TAlert | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const AlertConfirmDialogs = ({
  kind,
  alert,
  loading,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const open = Boolean(kind && alert);

  const title =
    kind === "done"
      ? t("alerts.confirm.doneTitle")
      : kind === "cancel"
        ? t("alerts.confirm.cancelTitle")
        : t("alerts.confirm.deleteTitle");

  const body =
    kind === "done"
      ? t("alerts.confirm.doneBody")
      : kind === "cancel"
        ? t("alerts.confirm.cancelBody")
        : t("alerts.confirm.deleteBody");

  const confirmLabel =
    kind === "done"
      ? t("alerts.confirm.doneConfirm")
      : kind === "cancel"
        ? t("alerts.confirm.cancelConfirm")
        : t("alerts.confirm.deleteConfirm");

  return (
    <AppDialog
      open={open}
      title={title}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <p className="m-0 text-sm text-(--Grey600)">{body}</p>
      {alert?.message ? (
        <p className="mt-2 mb-0 line-clamp-3 text-sm font-medium text-(--app-text)" dir="auto">
          {alert.message}
        </p>
      ) : null}
      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" onClick={onClose}>
          {t("alerts.confirm.close")}
        </AppButton>
        <AppButton
          variant={kind === "done" ? "primary" : "delete"}
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </AppButton>
      </div>
    </AppDialog>
  );
};

export default AlertConfirmDialogs;
