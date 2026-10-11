import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { AppSkeleton } from "@/shared/ANTD_UIComponents";
import type { UserControlModel } from "../hooks/useUserControl";
import { accentIndex } from "../utils/userControlDisplay";
import {
  badgeClass,
  emptyClass,
  faintClass,
  panelClass,
  panelHeadClass,
  panelTitleClass,
} from "../styles/userControlClasses";
import ScrollLoadSentinel from "./ScrollLoadSentinel";
import { CoverageMatrixSkeleton } from "./UserControlBoardSkeletons";

type Props = {
  userControl: UserControlModel;
};

const CoverageMatrix = ({ userControl }: Props) => {
  const { t } = useTranslation();

  if (
    userControl.roles.length === 0 &&
    (userControl.rolesPending || userControl.groupsPending) &&
    !userControl.rolesFailed
  ) {
    return <CoverageMatrixSkeleton />;
  }

  if (userControl.roles.length === 0) {
    return (
      <p className={emptyClass}>
        {userControl.rolesFailed
          ? t("userControl.roles.denied")
          : t("userControl.matrix.empty")}
      </p>
    );
  }

  return (
    <section className={panelClass}>
      <div className={panelHeadClass}>
        <h2 className={panelTitleClass}>{t("userControl.matrix.title")}</h2>
        <span className={faintClass}>{t("userControl.matrix.hint")}</span>
      </div>
      <div className="overflow-auto px-[18px] pt-1 pb-[18px]">
        <table className="w-full min-w-full border-separate border-spacing-1.5">
          <thead>
            <tr>
              <th className="text-start text-xs font-semibold whitespace-nowrap text-(--Grey600)">
                {t("userControl.matrix.role")}
              </th>
              {userControl.groups.map((group) => (
                <th key={group.name} className="text-center text-xs font-semibold text-(--Grey600)">
                  {group.name}
                </th>
              ))}
              <th className="text-center text-xs font-semibold text-(--Grey600)">
                {t("userControl.matrix.total")}
              </th>
            </tr>
          </thead>
          <tbody>
            {userControl.roles.map((role) => {
              const permissionStatus =
                userControl.rolePermissionStatus.get(role.id) ?? "loading";
              const granted =
                permissionStatus === "ready"
                  ? (userControl.rolePerms.get(role.id) ?? new Set<number>())
                  : null;
              const locked = role.isShared || !userControl.canSetPermissions;
              return (
                <tr key={role.id}>
                  <td className={clsx("text-start whitespace-nowrap", `ta-${accentIndex(role.name)}`)}>
                    <span className="me-1.5 inline-block size-2 rounded-full bg-(--ta-accent)" />
                    {role.name}
                    {role.isShared ? (
                      <span className={clsx("ms-1.5", badgeClass("teal"))}>
                        {t("userControl.badges.shared")}
                      </span>
                    ) : null}
                  </td>
                  {userControl.groups.map((group) => {
                    const count = granted
                      ? group.actions.filter((action) => granted.has(action.id)).length
                      : null;
                    const full =
                      count !== null &&
                      group.actions.length > 0 &&
                      count === group.actions.length;
                    return (
                      <td key={group.name}>
                        <button
                          type="button"
                          className={clsx(
                            "grid h-[46px] w-full min-w-[92px] cursor-pointer place-items-center rounded-[10px] border border-(--Grey300) bg-(--ta-accent-soft) text-xs font-bold text-(--app-text) disabled:cursor-not-allowed disabled:opacity-70",
                            `ta-${accentIndex(role.name)}`,
                          )}
                          disabled={locked || permissionStatus !== "ready"}
                          title={
                            permissionStatus === "error"
                              ? t("userControl.matrix.unavailable")
                              : permissionStatus === "loading"
                                ? t("userControl.matrix.loading")
                                : locked
                                  ? t("userControl.matrix.locked")
                                  : t(full ? "userControl.matrix.revoke" : "userControl.matrix.grant")
                          }
                          onClick={() =>
                            void userControl.togglePermissionGroup(role.id, group.name)
                          }
                        >
                          {count === null ? (
                            permissionStatus === "error" ? (
                              "—"
                            ) : (
                              <AppSkeleton.Button
                                active
                                size="small"
                                className="!h-4 !w-10 !min-w-10"
                              />
                            )
                          ) : (
                            `${count}/${group.actions.length}`
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td>
                    {granted ? (
                      `${Math.round((granted.size / (userControl.permissionTotal || 1)) * 100)}%`
                    ) : permissionStatus === "loading" ? (
                      <AppSkeleton.Button
                        active
                        size="small"
                        className="!h-4 !w-10 !min-w-10"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ScrollLoadSentinel
          hasMore={userControl.rolesHasNext || userControl.groupsHasNext}
          loading={userControl.rolesLoadingMore || userControl.groupsLoadingMore}
          onLoad={() => {
            if (userControl.rolesHasNext) userControl.loadMoreRoles();
            if (userControl.groupsHasNext) userControl.loadMoreGroups();
          }}
        />
      </div>
      <div className="flex items-center gap-2.5 px-[18px] pb-4 text-xs text-(--Grey600)">
        <span>0%</span>
        <span className="block h-1.5 w-40 overflow-hidden rounded-full bg-(--Grey100)">
          <span className="ta-0 block h-full w-full bg-(--ta-accent)" />
        </span>
        <span>100%</span>
        <span>{t("userControl.matrix.readonly")}</span>
      </div>
    </section>
  );
};

export default CoverageMatrix;
