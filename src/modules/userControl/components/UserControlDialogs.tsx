import clsx from "clsx";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppButton, AppDialog, AppInput, AppTextArea } from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import type { UserControlModel } from "../hooks/useUserControl";
import { mutedClass } from "../styles/userControlClasses";

type Props = {
  userControl: UserControlModel;
};

const dot: Record<string, string> = {
  ok: "✓",
  fail: "!",
  warn: "!",
  skip: "–",
  run: "…",
  wait: "",
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

      <AppDialog
        open={Boolean(userControl.inviteRun)}
        title={userControl.inviteRun?.title}
        closable={userControl.inviteRun?.closable ?? false}
        maskClosable={userControl.inviteRun?.closable ?? false}
        onCancel={userControl.inviteRun?.closable ? userControl.closeInviteRun : undefined}
        footer={
          <AppButton
            disabled={!userControl.inviteRun?.closable}
            onClick={userControl.closeInviteRun}
          >
            {t("userControl.invite.done")}
          </AppButton>
        }
      >
        <p className={mutedClass}>{userControl.inviteRun?.subtitle}</p>
        <ol className="m-0 mt-4 flex list-none flex-col p-0">
          {userControl.inviteRun?.steps.map((step, index) => (
            <li key={step.title} className="flex gap-3.5 pb-[18px]">
              <span
                className={clsx(
                  "grid size-8 shrink-0 place-items-center rounded-full border-2 border-(--Grey400) text-[13px] font-bold text-(--Grey600)",
                  step.status === "ok" &&
                    "border-(--statusG200) bg-(--statusG200) text-(--app-surface)",
                  step.status === "fail" &&
                    "border-(--statusR200) bg-(--statusR200) text-(--app-surface)",
                  step.status === "warn" &&
                    "border-(--statusY200) bg-(--statusY100) text-(--statusY200)",
                  step.status === "skip" && "border-dashed",
                )}
              >
                {dot[step.status] || index + 1}
              </span>
              <div>
                <b className="block">{step.title}</b>
                <small
                  dir="auto"
                  className={clsx(
                    "mt-[3px] block text-(--Grey600)",
                    step.status === "fail" && "text-(--statusR200)",
                    step.status === "warn" && "text-(--statusY200)",
                  )}
                >
                  {step.detail}
                </small>
              </div>
            </li>
          ))}
        </ol>
      </AppDialog>
    </>
  );
};

export default UserControlDialogs;
