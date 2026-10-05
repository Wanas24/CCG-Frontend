import clsx from "clsx";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/i18n/useLocale";
import { AppButton, AppCheckBox, AppDrawer, AppInput, AppSkeleton } from "@/shared/ANTD_UIComponents";
import type { UserControlModel } from "../hooks/useUserControl";
import { accentIndex, permissionLabel, personInitials, personName } from "../utils/userControlDisplay";
import {
  avatarClass,
  countClass,
  emptyClass,
  faintClass,
  mutedClass,
} from "../styles/userControlClasses";
import ScrollLoadSentinel from "./ScrollLoadSentinel";

type Props = {
  userControl: UserControlModel;
};

const RolePermissionDrawer = ({ userControl }: Props) => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const { drawer, drawerRole } = userControl;
  const open = Boolean(drawer);
  const total = userControl.permissionTotal || 1;
  const permissionStatus = drawerRole
    ? (userControl.rolePermissionStatus.get(drawerRole.id) ?? "loading")
    : "loading";
  const selected =
    permissionStatus === "ready"
      ? userControl.drawerDraft.size
      : (drawerRole?.permissionsCount ?? 0);
  const readOnly = !drawerRole || drawerRole.isShared || !userControl.canSetPermissions;
  const members = drawerRole
    ? [...userControl.employeeCatalog.values()].filter(
        (employee) =>
          userControl.userRoleStatus.get(employee.id) === "ready" &&
          userControl.userRoles.get(employee.id)?.has(drawerRole.id),
      )
    : [];

  return (
    <AppDrawer
      open={open}
      placement={isRtl ? "left" : "right"}
      width={560}
      title={drawerRole?.name ?? t("userControl.drawer.permissions")}
      onClose={userControl.requestCloseDrawer}
      footer={
        <div className="flex w-full items-center gap-2">
          {userControl.drawerDirty ? (
            <span className={faintClass}>{t("userControl.drawer.unsaved")}</span>
          ) : null}
          <div className="ms-auto flex gap-2">
            <AppButton variant="secondary" onClick={userControl.requestCloseDrawer}>
              {t("userControl.drawer.close")}
            </AppButton>
            {drawer?.tab === "perms" && drawerRole && !drawerRole.isShared && userControl.canSetPermissions ? (
              <AppButton onClick={() => void userControl.saveDrawer()}>
                {t("userControl.drawer.save")}
              </AppButton>
            ) : null}
          </div>
        </div>
      }
    >
      {drawer && drawerRole ? (
        <>
          <div className="mb-3 flex items-center gap-4">
            <div
              className="grid size-[72px] shrink-0 place-items-center rounded-full bg-[conic-gradient(var(--Primary400)_calc(var(--p)*1%),var(--Grey200)_0)] font-bold"
              style={{ ["--p" as string]: Math.round((selected / total) * 100) }}
            >
              <span className="grid size-[54px] place-items-center rounded-full bg-(--app-surface)">
                {Math.round((selected / total) * 100)}%
              </span>
            </div>
            <div>
              <p className={mutedClass}>
                {t("userControl.drawer.summary", {
                  count: selected,
                  total: userControl.permissionTotal,
                  members: members.length,
                })}
              </p>
            </div>
          </div>
          <div className="mb-3 flex gap-1">
            <button
              type="button"
              className={clsx(
                "cursor-pointer rounded-[9px] border-0 px-3 py-2 font-semibold",
                drawer.tab === "perms"
                  ? "bg-(--Grey200) text-(--app-text)"
                  : "bg-transparent text-(--Grey600)",
              )}
              onClick={() => userControl.setDrawerTab("perms")}
            >
              {t("userControl.drawer.permissions")}
            </button>
            <button
              type="button"
              className={clsx(
                "cursor-pointer rounded-[9px] border-0 px-3 py-2 font-semibold",
                drawer.tab === "members"
                  ? "bg-(--Grey200) text-(--app-text)"
                  : "bg-transparent text-(--Grey600)",
              )}
              onClick={() => userControl.setDrawerTab("members")}
            >
              {t("userControl.drawer.members")}
            </button>
          </div>
          {drawer.tab === "members" ? (
            members.length === 0 ? (
              <p className={emptyClass}>{t("userControl.drawer.noMembers")}</p>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="mb-2 flex items-center gap-2.5 rounded-[9px] border border-(--Grey300) p-2"
                >
                  <span className={clsx(avatarClass(), `ta-${accentIndex(member.email)}`)}>
                    {personInitials(member)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="overflow-hidden font-semibold text-ellipsis whitespace-nowrap" dir="auto">
                      {personName(member)}
                    </div>
                    <div className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-(--Grey600)">
                      {member.email}
                    </div>
                  </div>
                  {userControl.canUnassign ? (
                    <AppButton
                      variant="secondary"
                      onClick={() => void userControl.unassignRole(member.id, drawerRole.id)}
                    >
                      {t("userControl.employees.unassign")}
                    </AppButton>
                  ) : null}
                </div>
              ))
            )
          ) : null}
          {drawer.tab === "members" ? (
            <ScrollLoadSentinel
              hasMore={userControl.employeesHasNext}
              loading={userControl.employeesLoadingMore}
              onLoad={userControl.loadMoreEmployees}
            />
          ) : (
            <>
              {drawerRole.isShared ? (
                <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-(--statusB200) bg-(--statusB100) px-3.5 py-3 text-[13px] text-(--statusB200)">
                  {t("userControl.drawer.sharedNotice")}
                </div>
              ) : null}
              {permissionStatus === "error" ? (
                <p className={faintClass}>{t("userControl.drawer.failed")}</p>
              ) : permissionStatus === "loading" ? (
                <AppSkeleton active paragraph={{ rows: 6 }} />
              ) : null}
              {permissionStatus === "loading" ? null : (
              <>
              <AppInput
                value={drawer.query}
                prefix={<Search size={14} aria-hidden />}
                placeholder={t("userControl.drawer.filter")}
                onChange={(event) => userControl.setDrawerQuery(event.target.value)}
              />
              {permissionStatus === "ready" && userControl.drawerGroups.length === 0 ? (
                <p className={emptyClass}>{t("userControl.catalog.empty")}</p>
              ) : null}
              {permissionStatus === "ready"
                ? userControl.drawerGroups.map((group) => {
                const actions = group.actions;
                const on = group.actions.filter((action) =>
                  userControl.drawerDraft.has(action.id),
                ).length;
                return (
                  <div key={group.name} className="mb-2.5 overflow-hidden rounded-xl border border-(--Grey300)">
                    <div
                      className={clsx(
                        "flex items-center gap-2.5 bg-(--Grey200) px-3 py-2.5 font-semibold",
                        `ta-${accentIndex(group.name)}`,
                      )}
                    >
                      <AppCheckBox
                        checked={on === group.actions.length && group.actions.length > 0}
                        indeterminate={on > 0 && on < group.actions.length}
                        disabled={readOnly}
                        onChange={(event) =>
                          userControl.toggleDraftGroup(group.name, event.target.checked)
                        }
                      />
                      <span className="grid size-7 place-items-center rounded-[9px] bg-(--ta-accent) text-[11px] font-extrabold text-(--app-surface)">
                        {group.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span>{group.name}</span>
                      <span className={countClass}>
                        {on}/{group.actions.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-0.5 p-1.5 min-[1251px]:grid-cols-2">
                      {actions.map((action) => (
                        <label key={action.id} className="flex items-start gap-2.5 rounded-[9px] p-2">
                          <AppCheckBox
                            checked={userControl.drawerDraft.has(action.id)}
                            disabled={readOnly}
                            onChange={(event) =>
                              userControl.toggleDraftPermission(action.id, event.target.checked)
                            }
                          />
                          <span>
                            <span dir="auto">{permissionLabel(action)}</span>
                            <small className="block">
                              <code className="text-[11px] text-(--Grey600)">{action.name}</code>
                            </small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })
                : null}
              <ScrollLoadSentinel
                hasMore={permissionStatus === "ready" && userControl.drawerGroupsHasNext}
                loading={userControl.drawerGroupsLoadingMore}
                onLoad={userControl.loadMoreDrawerGroups}
              />
              </>
              )}
            </>
          )}
        </>
      ) : null}
    </AppDrawer>
  );
};

export default RolePermissionDrawer;
