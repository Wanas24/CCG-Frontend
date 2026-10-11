import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppButton, AppDialog, AppInput, AppTextArea } from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import type { UserControlModel } from "../hooks/useUserControl";
import { mutedClass } from "../styles/userControlClasses";

type Props = {
  userControl: UserControlModel;
};

const UserControlDialogs = ({ userControl }: Props) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const confirm = userControl.confirmState;

  return (
    <>
      <AppDialog
        open={userControl.roleModalOpen}
        title={
          userControl.editingRole
            ? t("userControl.roleForm.editTitle", { name: userControl.editingRole.name })
            : t("userControl.roleForm.createTitle")
        }
        onCancel={userControl.closeRoleModal}
        footer={null}
        destroyOnHidden
      >
        <p className={mutedClass}>{t("userControl.roleForm.subtitle")}</p>
        <form className="mt-4 flex flex-col gap-3" onSubmit={userControl.submitRole}>
          <Controller
            name="name"
            control={userControl.roleForm.control}
            render={({ field, fieldState }) => (
              <AppInput
                {...field}
                required
                label={t("userControl.roleForm.name")}
                placeholder={t("userControl.roleForm.namePlaceholder")}
                errorMsg={translateError(fieldState.error?.message)}
              />
            )}
          />
          <Controller
            name="description"
            control={userControl.roleForm.control}
            render={({ field, fieldState }) => (
              <AppTextArea
                {...field}
                label={t("userControl.roleForm.description")}
                placeholder={t("userControl.roleForm.descriptionPlaceholder")}
                errorMsg={translateError(fieldState.error?.message)}
              />
            )}
          />
          <div className="flex justify-end gap-2">
            <AppButton variant="secondary" htmlType="button" onClick={userControl.closeRoleModal}>
              {t("userControl.roleForm.cancel")}
            </AppButton>
            <AppButton htmlType="submit" loading={userControl.roleSaving}>
              {userControl.editingRole
                ? t("userControl.roleForm.save")
                : t("userControl.roleForm.create")}
            </AppButton>
          </div>
        </form>
      </AppDialog>

      <AppDialog
        open={Boolean(confirm)}
        title={
          confirm?.kind === "delete"
            ? t("userControl.deleteRole.title", { name: confirm.role.name })
            : t("userControl.drawer.discardTitle")
        }
        onCancel={userControl.cancelConfirm}
        footer={
          <div className="flex justify-end gap-2">
            <AppButton variant="secondary" onClick={userControl.cancelConfirm}>
              {t("userControl.deleteRole.cancel")}
            </AppButton>
            <AppButton
              variant={confirm?.kind === "delete" ? "delete" : "primary"}
              loading={userControl.confirmPending}
              onClick={() => void userControl.acceptConfirm()}
            >
              {confirm?.kind === "delete"
                ? t("userControl.deleteRole.confirm")
                : t("userControl.drawer.discard")}
            </AppButton>
          </div>
        }
      >
        <p>
          {confirm?.kind === "delete"
            ? confirm.role.usersCount > 0
              ? t("userControl.deleteRole.withMembers", { count: confirm.role.usersCount })
              : t("userControl.deleteRole.empty")
            : t("userControl.drawer.discardText")}
        </p>
      </AppDialog>
    </>
  );
};

export default UserControlDialogs;
