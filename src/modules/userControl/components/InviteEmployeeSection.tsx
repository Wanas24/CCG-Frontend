import clsx from "clsx";
import { useDroppable } from "@dnd-kit/core";
import { Controller } from "react-hook-form";
import { Mail, Send, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton, AppInput, AppSkeleton } from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import type { UserControlModel } from "../hooks/useUserControl";
import { accentIndex } from "../utils/userControlDisplay";
import {
  countClass,
  faintClass,
  markClass,
  mutedClass,
  panelTitleClass,
  pickClass,
  pickDotClass,
  stepLabelClass,
} from "../styles/userControlClasses";
import ScrollLoadSentinel from "./ScrollLoadSentinel";
import {
  type UserControlDragPayload,
  type UserControlDropTarget,
} from "./userControlDrag";

type Props = {
  userControl: UserControlModel;
  drag: UserControlDragPayload | null;
};

const InviteEmployeeSection = ({ userControl, drag }: Props) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const { setNodeRef } = useDroppable({
    id: "drop-invite",
    data: { target: "invite" } satisfies UserControlDropTarget,
    disabled: !userControl.canRecruit || !userControl.canSetUserRoles,
  });
  const canDropRole = drag?.type === "role" && userControl.canSetUserRoles;

  if (!userControl.canRecruit) return null;

  const selectedProjects = [...userControl.inviteProjectIds]
    .filter(
      (projectId) =>
        !userControl.inviteProjects.some((project) => project.id === projectId),
    )
    .map((projectId) => userControl.projectCatalog.get(projectId))
    .filter((project) => project !== undefined);
  const projects = [...selectedProjects, ...userControl.inviteProjects];
  const projectSearch = userControl.projectSearch.trim().length > 0;

  return (
    <section
      ref={setNodeRef}
      className="relative overflow-hidden rounded-2xl border border-(--Grey300) bg-(--app-surface) px-5 py-4"
    >
      <span className="absolute inset-y-0 start-0 w-1 bg-(--Primary400)" />
      <div className="flex items-center gap-2.5">
        <div className={markClass}>
          <UserPlus size={18} aria-hidden />
        </div>
        <div>
          <h2 className={panelTitleClass}>{t("userControl.invite.title")}</h2>
          <p className={mutedClass}>{t("userControl.invite.subtitle")}</p>
        </div>
      </div>

      <form
        className="mt-3 grid grid-cols-1 items-start gap-4 min-[1251px]:grid-cols-[minmax(220px,1fr)_minmax(0,1.6fr)_minmax(0,1.6fr)_220px]"
        onSubmit={userControl.submitInvite}
        noValidate
      >
        <div>
          <div className={stepLabelClass}>{t("userControl.invite.email")}</div>
          <Controller
            name="employeeEmail"
            control={userControl.inviteForm.control}
            render={({ field, fieldState }) => (
              <AppInput
                {...field}
                type="email"
                autoComplete="off"
                placeholder={t("userControl.invite.emailPlaceholder")}
                prefix={<Mail size={14} aria-hidden />}
                errorMsg={translateError(fieldState.error?.message)}
              />
            )}
          />
        </div>

        {userControl.canSetUserRoles ? (
          <div>
            <div className={stepLabelClass}>
              <span>{t("userControl.invite.roles")}</span>
              <span className={faintClass}>
                {t("userControl.invite.rolesHint")}
              </span>
              <span className={countClass}>{userControl.inviteRoleIds.size}</span>
            </div>
            <div
              className={clsx(
                "flex h-[92px] flex-wrap content-start gap-1.5 overflow-auto rounded-xl border bg-(--Grey100) p-2",
                canDropRole ? "border-(--Primary400)" : "border-(--Grey400)",
              )}
            >
              {userControl.rolesPending && !userControl.rolesFailed ? (
                <AppSkeleton.Button active className="!h-7 !w-24 !min-w-24" />
              ) : userControl.rolesFailed ? (
                <span className={faintClass}>
                  {t("userControl.invite.rolesDenied")}
                </span>
              ) : userControl.roles.length === 0 ? (
                <span className={faintClass}>
                  {t("userControl.invite.noRoles")}
                </span>
              ) : (
                userControl.roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={clsx(
                      pickClass(userControl.inviteRoleIds.has(role.id)),
                      `ta-${accentIndex(role.name)}`,
                    )}
                    title={role.description || role.name}
                    onClick={() => userControl.toggleInviteRole(role.id)}
                  >
                    <i className={pickDotClass(userControl.inviteRoleIds.has(role.id))} />
                    {role.name}
                  </button>
                ))
              )}
              <ScrollLoadSentinel
                hasMore={userControl.rolesHasNext}
                loading={userControl.rolesLoadingMore}
                onLoad={userControl.loadMoreRoles}
              />
            </div>
          </div>
        ) : null}

        {userControl.canSetProjects ? (
          <div>
            <div className={stepLabelClass}>
              <span>{t("userControl.invite.projects")}</span>
              <span className={faintClass}>
                {t("userControl.invite.projectsHint")}
              </span>
              <span className={countClass}>
                {userControl.inviteProjectIds.size}
              </span>
              <AppInput
                className="w-[40%]!"
                value={userControl.projectSearch}
                disabled={userControl.projectsStatus === "error"}
                placeholder={t("userControl.invite.searchProjects")}
                onChange={(event) => userControl.setProjectSearch(event.target.value)}
              />
            </div>
            <div className="flex h-[92px] flex-wrap content-start gap-1.5 overflow-auto rounded-xl border border-(--Grey400) bg-(--Grey100) p-2">
              {userControl.inviteProjectsStatus === "error" ? (
                <span className={faintClass}>
                  {t("userControl.invite.projectsDenied")}
                </span>
              ) : userControl.inviteProjectsStatus === "loading" ? (
                <AppSkeleton.Button active className="!h-7 !w-28 !min-w-28" />
              ) : projects.length === 0 ? (
                <span className={faintClass}>
                  {projectSearch
                    ? t("userControl.invite.noProjectMatch")
                    : t("userControl.invite.noProjects")}
                </span>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className={clsx(
                      pickClass(userControl.inviteProjectIds.has(project.id)),
                      "ta-2",
                    )}
                    title={project.number}
                    onClick={() => userControl.toggleInviteProject(project.id)}
                  >
                    <i className={pickDotClass(userControl.inviteProjectIds.has(project.id))} />
                    {project.name}
                  </button>
                ))
              )}
              <ScrollLoadSentinel
                hasMore={
                  userControl.inviteProjectsHasNext &&
                  userControl.inviteProjectsStatus === "ready"
                }
                loading={userControl.inviteProjectsLoadingMore}
                onLoad={userControl.loadMoreInviteProjects}
              />
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 pt-7">
          <div
            className={clsx(
              "flex justify-center rounded-[10px] border px-2.5 py-1.5 text-center text-xs",
              userControl.invitePreview.hasRoles
                ? "border-(--Grey300) bg-(--Grey200) text-(--Grey600)"
                : "border-(--statusY200) bg-(--statusY100) text-(--statusY200)",
            )}
          >
            {userControl.invitePreview.hasRoles
              ? t("userControl.invite.preview", {
                  permissions: userControl.invitePreview.permissionCount,
                  groups: userControl.invitePreview.groupCount,
                  projects: userControl.invitePreview.projectCount,
                })
              : t("userControl.invite.noAccess")}
          </div>
          <AppButton
            htmlType="submit"
            block
            disabled={!userControl.emailValid || userControl.invitePending}
            icon={<Send size={16} aria-hidden />}
          >
            {t("userControl.invite.send")}
          </AppButton>
        </div>
      </form>
    </section>
  );
};

export default InviteEmployeeSection;
