import { useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/i18n/useLocale";
import type { UserControlModel } from "../hooks/useUserControl";
import { accentIndex, personName } from "../utils/userControlDisplay";
import {
  emptyClass,
  faintClass,
  panelClass,
  panelHeadClass,
  panelTitleClass,
} from "../styles/userControlClasses";
import ScrollLoadSentinel from "./ScrollLoadSentinel";
import { AccessMapSkeleton } from "./UserControlBoardSkeletons";

type Props = {
  userControl: UserControlModel;
};

type Focus =
  | { kind: "user"; id: string }
  | { kind: "role"; id: string }
  | { kind: "group"; id: string }
  | null;

const ACCENTS = [
  "var(--Primary400)",
  "var(--Secondary300)",
  "var(--statusB200)",
  "var(--statusY200)",
  "var(--statusG200)",
  "var(--statusR200)",
];

const AccessMap = ({ userControl }: Props) => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const [focus, setFocus] = useState<Focus>(null);
  const { employees, roles, groups, userRoles, rolePerms } = userControl;

  if (
    roles.length === 0 &&
    employees.length === 0 &&
    (userControl.rolesPending || userControl.employeesPending) &&
    !userControl.rolesFailed &&
    !userControl.employeesFailed
  ) {
    return <AccessMapSkeleton />;
  }

  if (roles.length === 0 && employees.length === 0) {
    return (
      <p className={emptyClass}>
        {userControl.rolesFailed || userControl.employeesFailed
          ? t("userControl.loadFailed")
          : t("userControl.map.empty")}
      </p>
    );
  }

  const width = 980;
  const rowHeight = 36;
  const top = 48;
  const height = Math.max(
    280,
    Math.max(employees.length, roles.length, groups.length) * rowHeight + top + 24,
  );
  const columns = isRtl ? [width - 180, width / 2, 180] : [180, width / 2, width - 180];
  const yFor = (count: number, index: number) =>
    top + (index + 0.5) * ((height - top - 20) / Math.max(count, 1));
  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const mid = (x1 + x2) / 2;
    return `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`;
  };

  const focusedUsers = new Set<string>();
  const focusedRoles = new Set<string>();
  const focusedGroups = new Set<string>();
  const groupsOfRole = (roleId: string) =>
    groups
      .filter((group) =>
        group.actions.some((action) => rolePerms.get(roleId)?.has(action.id)),
      )
      .map((group) => group.name);

  if (focus?.kind === "user") {
    focusedUsers.add(focus.id);
    userRoles.get(focus.id)?.forEach((roleId) => focusedRoles.add(roleId));
    focusedRoles.forEach((roleId) =>
      groupsOfRole(roleId).forEach((name) => focusedGroups.add(name)),
    );
  }
  if (focus?.kind === "role") {
    focusedRoles.add(focus.id);
    employees
      .filter((employee) => userRoles.get(employee.id)?.has(focus.id))
      .forEach((employee) => focusedUsers.add(employee.id));
    groupsOfRole(focus.id).forEach((name) => focusedGroups.add(name));
  }
  if (focus?.kind === "group") {
    focusedGroups.add(focus.id);
    const group = groups.find((item) => item.name === focus.id);
    roles
      .filter((role) =>
        group?.actions.some((action) => rolePerms.get(role.id)?.has(action.id)),
      )
      .forEach((role) => focusedRoles.add(role.id));
    focusedRoles.forEach((roleId) =>
      employees
        .filter((employee) => userRoles.get(employee.id)?.has(roleId))
        .forEach((employee) => focusedUsers.add(employee.id)),
    );
  }

  const active = Boolean(focus);

  return (
    <section className={clsx(panelClass, "ta-map-open")}>
      <div className={panelHeadClass}>
        <h2 className={panelTitleClass}>{t("userControl.map.title")}</h2>
        <span className={faintClass}>{t("userControl.map.hint")}</span>
      </div>
      <div
        className="max-h-[calc(100vh-280px)] overflow-auto px-2 pt-2 pb-4"
        onMouseLeave={() => setFocus(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto block h-auto w-full max-w-[980px] [direction:ltr]"
          style={{ direction: "ltr" }}
        >
          <text
            className="fill-(--Grey500) text-[11px] font-bold tracking-[0.08em] uppercase"
            x={columns[0]}
            y={26}
            textAnchor="middle"
          >
            {t("userControl.map.people")}
          </text>
          <text
            className="fill-(--Grey500) text-[11px] font-bold tracking-[0.08em] uppercase"
            x={columns[1]}
            y={26}
            textAnchor="middle"
          >
            {t("userControl.map.roles")}
          </text>
          <text
            className="fill-(--Grey500) text-[11px] font-bold tracking-[0.08em] uppercase"
            x={columns[2]}
            y={26}
            textAnchor="middle"
          >
            {t("userControl.map.groups")}
          </text>
          {employees.map((employee, index) =>
            [...(userRoles.get(employee.id) ?? [])].map((roleId) => {
              const roleIndex = roles.findIndex((role) => role.id === roleId);
              const role = roles[roleIndex];
              if (!role || roleIndex < 0) return null;
              const highlighted =
                focusedUsers.has(employee.id) && focusedRoles.has(role.id);
              return (
                <path
                  key={`${employee.id}-${role.id}`}
                  className={clsx("ta-map-edge", active && !highlighted && "opacity-[0.08]")}
                  pathLength={1}
                  d={curve(
                    columns[0] + (isRtl ? -14 : 14),
                    yFor(employees.length, index),
                    columns[1] + (isRtl ? 70 : -70),
                    yFor(roles.length, roleIndex),
                  )}
                  fill="none"
                  stroke={ACCENTS[accentIndex(role.name)]}
                  strokeWidth={highlighted ? 3.5 : 2}
                />
              );
            }),
          )}
          {roles.map((role, roleIndex) =>
            groups.map((group, groupIndex) => {
              const count = group.actions.filter((action) =>
                rolePerms.get(role.id)?.has(action.id),
              ).length;
              if (!count) return null;
              const highlighted =
                focusedRoles.has(role.id) && focusedGroups.has(group.name);
              return (
                <path
                  key={`${role.id}-${group.name}`}
                  className={clsx("ta-map-edge", active && !highlighted && "opacity-[0.08]")}
                  pathLength={1}
                  d={curve(
                    columns[1] + (isRtl ? -70 : 70),
                    yFor(roles.length, roleIndex),
                    columns[2] + (isRtl ? 14 : -14),
                    yFor(groups.length, groupIndex),
                  )}
                  fill="none"
                  stroke={ACCENTS[accentIndex(role.name)]}
                  strokeWidth={1 + (5 * count) / group.actions.length}
                >
                  <title>
                    {role.name} → {group.name}: {count}/{group.actions.length}
                  </title>
                </path>
              );
            }),
          )}
          {employees.map((employee, index) => {
            const highlighted = !active || focusedUsers.has(employee.id);
            return (
              <g
                key={employee.id}
                className={clsx(active && !highlighted && "opacity-25")}
                transform={`translate(${columns[0]},${yFor(employees.length, index)})`}
                onMouseEnter={() => setFocus({ kind: "user", id: employee.id })}
              >
                <circle r={12} fill={ACCENTS[accentIndex(employee.email)]} />
                <text
                  className="fill-(--app-text) text-xs font-semibold"
                  x={isRtl ? 22 : -22}
                  y={-1}
                  textAnchor={isRtl ? "start" : "end"}
                >
                  {personName(employee)}
                </text>
                <text
                  className="fill-(--Grey500) text-[11px] font-medium"
                  x={isRtl ? 22 : -22}
                  y={12}
                  textAnchor={isRtl ? "start" : "end"}
                >
                  {employee.isManager
                    ? t("userControl.map.manager")
                    : userControl.userRoleStatus.get(employee.id) === "ready"
                      ? t("userControl.map.roleCount", {
                          count: userRoles.get(employee.id)?.size ?? 0,
                        })
                      : userControl.userRoleStatus.get(employee.id) === "loading"
                        ? ""
                        : t("userControl.map.rolesUnknown")}
                </text>
              </g>
            );
          })}
          {roles.map((role, index) => (
            <g
              key={role.id}
              className={clsx(active && focusedRoles.has(role.id) === false && "opacity-25")}
              transform={`translate(${columns[1]},${yFor(roles.length, index)})`}
              onMouseEnter={() => setFocus({ kind: "role", id: role.id })}
            >
              <rect
                x={-70}
                y={-15}
                width={140}
                height={30}
                rx={15}
                fill={ACCENTS[accentIndex(role.name)]}
                opacity={0.18}
                stroke={ACCENTS[accentIndex(role.name)]}
              />
              <text className="fill-(--app-text) text-xs font-semibold" textAnchor="middle" y={4}>
                {role.name.length > 18 ? `${role.name.slice(0, 17)}…` : role.name}
              </text>
            </g>
          ))}
          {groups.map((group, index) => (
            <g
              key={group.name}
              className={clsx(active && !focusedGroups.has(group.name) && "opacity-25")}
              transform={`translate(${columns[2]},${yFor(groups.length, index)})`}
              onMouseEnter={() => setFocus({ kind: "group", id: group.name })}
            >
              <rect
                x={-12}
                y={-12}
                width={24}
                height={24}
                rx={7}
                fill={ACCENTS[accentIndex(group.name)]}
              />
              <text
                className="fill-(--app-text) text-xs font-semibold"
                x={isRtl ? -22 : 22}
                y={-1}
                textAnchor={isRtl ? "end" : "start"}
              >
                {group.name}
              </text>
              <text
                className="fill-(--Grey500) text-[11px] font-medium"
                x={isRtl ? -22 : 22}
                y={12}
                textAnchor={isRtl ? "end" : "start"}
              >
                {t("userControl.map.permissionCount", { count: group.actions.length })}
              </text>
            </g>
          ))}
        </svg>
        <ScrollLoadSentinel
          hasMore={userControl.employeesHasNext || userControl.rolesHasNext || userControl.groupsHasNext}
          loading={
            userControl.employeesLoadingMore || userControl.rolesLoadingMore || userControl.groupsLoadingMore
          }
          onLoad={() => {
            if (userControl.employeesHasNext) userControl.loadMoreEmployees();
            if (userControl.rolesHasNext) userControl.loadMoreRoles();
            if (userControl.groupsHasNext) userControl.loadMoreGroups();
          }}
        />
      </div>
    </section>
  );
};

export default AccessMap;
