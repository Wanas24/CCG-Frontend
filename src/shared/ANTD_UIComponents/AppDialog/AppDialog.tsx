import type { MouseEventHandler, PropsWithChildren } from "react";
import { Modal, type ModalProps } from "antd";
import "./AppDialog.css";
import { CircleX } from "lucide-react";
import AppButton from "../AppButton/AppButton";

export type AppDialogProps = PropsWithChildren<ModalProps>;

const AppDialogBase = ({ footer, ...props }: AppDialogProps) => {
  return (
    <Modal
      centered={true}
      closeIcon={<CircleX size={22} strokeWidth={1.5} />}
      {...props}
      footer={
        footer !== undefined ? (
          footer
        ) : (
          <div className="flex justify-end gap-2">
            <AppButton
              variant="tertiary"
              onClick={props.onCancel as MouseEventHandler<HTMLButtonElement>}
            >
              Cancel
            </AppButton>
            <AppButton variant="primary" onClick={props.onOk}>
              Submit
            </AppButton>
          </div>
        )
      }
    />
  );
};

type AppDialogComponent = typeof AppDialogBase & {
  confirm: typeof Modal.confirm;
  info: typeof Modal.info;
  success: typeof Modal.success;
  error: typeof Modal.error;
  warning: typeof Modal.warning;
  warn: typeof Modal.warn;
  useModal: typeof Modal.useModal;
  destroyAll: typeof Modal.destroyAll;
  config: typeof Modal.config;
};

const AppDialog = AppDialogBase as AppDialogComponent;
AppDialog.confirm = Modal.confirm;
AppDialog.info = Modal.info;
AppDialog.success = Modal.success;
AppDialog.error = Modal.error;
AppDialog.warning = Modal.warning;
AppDialog.warn = Modal.warn;
AppDialog.useModal = Modal.useModal;
AppDialog.destroyAll = Modal.destroyAll;
AppDialog.config = Modal.config;

export default AppDialog;
export { AppDialog };
