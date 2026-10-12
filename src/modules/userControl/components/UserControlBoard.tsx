import {
  startTransition,
  useCallback,
  useState,
  ViewTransition,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Tooltip } from "antd";
import { KeyRound, Lock, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppInput, AppSkeleton } from "@/shared/ANTD_UIComponents";
import type { UserControlModel } from "../hooks/useUserControl";
import type { TApplicationRole, TEmployee } from "../types";
import {
  accentIndex,
  permissionLabel,
  personInitials,
  personName,
} from "../utils/userControlDisplay";
import {
  avatarClass,
  badgeClass,
  countClass,
  dragOutline,
  emptyClass,
  faintClass,
  iconButtonClass,
  markClass,
  overOutlineClass,
  panelBodyClass,
  panelClass,
  panelHeadClass,
  panelSearchClass,
  panelTitleClass,
} from "../styles/userControlClasses";
import ScrollLoadSentinel from "./ScrollLoadSentinel";
import {
  CatalogGroupsSkeleton,
  EmployeeListSkeleton,
  RoleCardsSkeleton,
} from "./UserControlBoardSkeletons";
import {
  type UserControlDragPayload,
  type UserControlDropTarget,
} from "./userControlDrag";

type Props = {
  userControl: UserControlModel;
  drag: UserControlDragPayload | null;
};

const accentClass = (seed: string) => `ta-${accentIndex(seed)}`;

const stopPointer = (event: { stopPropagation: () => void }) => {
  event.stopPropagation();
};

const listMessage = (
  failed: boolean,
  searching: boolean,
  denied: string,
  searchFailed: string,
  noMatch: string,
  empty: string,
) => {
  if (failed && searching) return searchFailed;
  if (failed) return denied;
  if (searching) return noMatch;
  return empty;
};

const UserControlBoard = ({ userControl, drag }: Props) => {
  const { t } = useTranslation();
  const [picker, setPicker] = useState<{
    userId: string;
    top: number;
    left: number;
  } | null>(null);
  const employeeSearch = userControl.employeeSearch.trim().length > 0;
  const roleSearch =
    userControl.roleSearch.trim().length > 0 || userControl.roleFilter !== "all";
  const permissionSearch = userControl.permissionSearch.trim().length > 0;
  const employees = userControl.boardEmployees;
  const roles = userControl.boardRoles;

  const membersOf = (roleId: string) =>
    [...userControl.employeeCatalog.values()].filter((employee) =>
      userControl.userRoles.get(employee.id)?.has(roleId),
    );

  return (
    <div className="grid grid-cols-1 items-start gap-[18px] min-[1251px]:grid-cols-[minmax(280px,340px)_minmax(0,1fr)_minmax(280px,360px)]">
      <section className={panelClass}>
        <div className={panelHeadClass}>
          <h2 className={panelTitleClass}>
            {t("userControl.employees.title")}
          </h2>
          <span className={countClass}>{userControl.employeesTotal}</span>
        </div>
        <div className={panelSearchClass}>
          <AppInput
            value={userControl.employeeSearch}
            prefix={<Search size={14} aria-hidden />}
            placeholder={t("userControl.employees.search")}
            onChange={(event) => userControl.setEmployeeSearch(event.target.value)}
          />
        </div>
        <div className={panelBodyClass}>
          {userControl.boardEmployeesPending && !userControl.boardEmployeesFailed ? (
            <EmployeeListSkeleton />
          ) : (
            <>
              {employees.length === 0 ? (
                <p className={emptyClass}>
                  {listMessage(
                    userControl.boardEmployeesFailed,
                    employeeSearch,
                    t("userControl.employees.denied"),
                    t("userControl.employees.searchFailed"),
                    t("userControl.employees.noMatch"),
                    t("userControl.employees.empty"),
                  )}
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {employees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      userControl={userControl}
                      drag={drag}
                      onPickRole={(anchor) => {
                        const rect = anchor.getBoundingClientRect();
                        setPicker({
                          userId: employee.id,
                          top: rect.bottom + 6,
                          left: Math.min(rect.left, window.innerWidth - 240),
                        });
                      }}
                    />
                  ))}
                </div>
              )}
              <ScrollLoadSentinel
                hasMore={userControl.boardEmployeesHasNext}
                loading={userControl.boardEmployeesLoadingMore}
                onLoad={userControl.loadMoreBoardEmployees}
              />
            </>
          )}
        </div>
      </section>

      <section className={panelClass}>
        <div className={panelHeadClass}>
          <h2 className={panelTitleClass}>{t("userControl.roles.title")}</h2>
          <span className={countClass}>{userControl.rolesTotal}</span>
          <div className="ms-auto flex flex-wrap gap-1.5">
            {(["all", "company", "shared"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                className={clsx(
                  "cursor-pointer rounded-full border px-[11px] py-[5px] text-xs font-semibold",
                  userControl.roleFilter === filter
                    ? "border-(--app-text) bg-(--app-text) text-(--app-surface)"
                    : "border-(--Grey400) bg-transparent text-(--Grey600)",
                )}
                onClick={() =>
                  startTransition(() => userControl.setRoleFilter(filter))
                }
              >
                {t(`userControl.roles.${filter}`)}
              </button>
            ))}
          </div>
        </div>
        <div className={panelSearchClass}>
          <AppInput
            value={userControl.roleSearch}
            prefix={<Search size={14} aria-hidden />}
            placeholder={t("userControl.roles.search")}
            onChange={(event) => userControl.setRoleSearch(event.target.value)}
          />
        </div>
        <div className={panelBodyClass}>
          <ViewTransition>
            {userControl.boardRolesPending && !userControl.boardRolesFailed ? (
              <RoleCardsSkeleton />
            ) : (
              <>
                {roles.length === 0 ? (
                  <p className={emptyClass}>
                    {listMessage(
                      userControl.boardRolesFailed,
                      roleSearch,
                      t("userControl.roles.denied"),
                      t("userControl.roles.searchFailed"),
                      t("userControl.roles.noMatch"),
                      t("userControl.roles.empty"),
                    )}
                  </p>
                ) : null}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3.5">
                  {roles.map((role) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      members={membersOf(role.id)}
                      userControl={userControl}
                      drag={drag}
                    />
                  ))}
                  {userControl.canCreateRole && userControl.roleFilter !== "shared" ? (
                    <button
                      type="button"
                      className="grid min-h-[190px] cursor-pointer place-items-center gap-2 rounded-2xl border-2 border-dashed border-(--Grey400) bg-transparent font-semibold text-(--Grey600)"
                      onClick={userControl.openCreateRole}
                    >
                      <span className={markClass}>
                        <Plus size={18} aria-hidden />
                      </span>
                      {t("userControl.roles.create")}
                    </button>
                  ) : null}
                </div>
                <ScrollLoadSentinel
                  hasMore={userControl.boardRolesHasNext}
                  loading={userControl.boardRolesLoadingMore}
                  onLoad={userControl.loadMoreBoardRoles}
                />
              </>
            )}
          </ViewTransition>
        </div>
      </section>

      <section className={panelClass}>
        <div className={panelHeadClass}>
          <h2 className={panelTitleClass}>{t("userControl.catalog.title")}</h2>
          <span className={countClass}>{userControl.groupsTotal}</span>
        </div>
        <div className={panelSearchClass}>
          <AppInput
            value={userControl.permissionSearch}
            prefix={<Search size={14} aria-hidden />}
            placeholder={t("userControl.catalog.search")}
            onChange={(event) => userControl.setPermissionSearch(event.target.value)}
          />
        </div>
        <div className={clsx(panelBodyClass, "min-[1251px]:max-h-[400px]!")}>
          {userControl.catalogPending && !userControl.catalogFailed ? (
            <CatalogGroupsSkeleton />
          ) : userControl.catalogGroups.length === 0 ? (
            <p className={emptyClass}>
              {listMessage(
                userControl.catalogFailed,
                permissionSearch,
                t("userControl.catalog.denied"),
                t("userControl.catalog.searchFailed"),
                t("userControl.catalog.empty"),
                t("userControl.catalog.empty"),
              )}
            </p>
          ) : (
            <>
              <Catalog userControl={userControl} searching={permissionSearch} />
              <ScrollLoadSentinel
                hasMore={userControl.catalogHasNext}
                loading={userControl.catalogLoadingMore}
                onLoad={userControl.loadMoreCatalog}
              />
            </>
          )}
        </div>
      </section>

      {picker ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[70] cursor-default border-0 bg-transparent"
            aria-label={t("userControl.drawer.close")}
            onClick={() => setPicker(null)}
          />
          <div
            className="fixed z-[80] max-h-[280px] min-w-[220px] overflow-auto rounded-[14px] border border-(--Grey400) bg-(--app-surface) p-1.5 shadow-[0_18px_40px_-22px_var(--Grey500)]"
            style={{ top: picker.top, left: picker.left }}
          >
            {userControl.roles.filter(
              (role) => !userControl.userRoles.get(picker.userId)?.has(role.id),
            ).length === 0 ? (
              <p className={faintClass}>{t("userControl.picker.empty")}</p>
            ) : (
              userControl.roles
                .filter(
                  (role) =>
                    !userControl.userRoles.get(picker.userId)?.has(role.id),
                )
                .map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-[9px] border-0 bg-transparent px-2.5 py-[9px] text-start font-medium text-inherit hover:bg-(--Grey200)"
                    onClick={() => {
                      void userControl.assignRole(picker.userId, role.id);
                      setPicker(null);
                    }}
                  >
                    <i
                      className={clsx(
                        "size-2 rounded-full bg-(--ta-accent)",
                        accentClass(role.name),
                      )}
                    />
                    <span>{role.name}</span>
                    {role.isShared ? (
                      <span className={badgeClass("teal")}>
                        {t("userControl.badges.shared")}
                      </span>
                    ) : null}
                  </button>
                ))
            )}
            <ScrollLoadSentinel
              hasMore={userControl.rolesHasNext}
              loading={userControl.rolesLoadingMore}
              onLoad={userControl.loadMoreRoles}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

type EmployeeCardProps = {
  employee: TEmployee;
  userControl: UserControlModel;
  drag: UserControlDragPayload | null;
  onPickRole: (anchor: HTMLButtonElement) => void;
};

const EmployeeCard = ({
  employee,
  userControl,
  drag,
  onPickRole,
}: EmployeeCardProps) => {
  const { t } = useTranslation();
  const roleStatus = userControl.userRoleStatus.get(employee.id) ?? "loading";
  const assigned =
    roleStatus === "ready"
      ? [...(userControl.userRoles.get(employee.id) ?? [])]
          .map((roleId) => userControl.roleCatalog.get(roleId))
          .filter((role): role is TApplicationRole => Boolean(role))
      : [];
  const projects = userControl.userProjects.get(employee.id) ?? [];
  const canDrop =
    drag?.type === "role" &&
    !userControl.userRoles.get(employee.id)?.has(drag.id);
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `drag-user:${employee.id}`,
    data: { type: "user", id: employee.id } satisfies UserControlDragPayload,
    disabled: !userControl.canAssign,
  });
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-user:${employee.id}`,
    data: {
      target: "employee",
      userId: employee.id,
    } satisfies UserControlDropTarget,
    disabled: drag != null && !canDrop,
  });
  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef],
  );

  return (
    <article
      ref={setNodeRef}
      className={clsx(
        "relative rounded-[14px] border border-(--Grey300) bg-(--Grey200) p-3",
        dragOutline("role"),
        isDragging && "opacity-40",
        isOver && canDrop && overOutlineClass,
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2.5">
        <span className={clsx(avatarClass(), accentClass(employee.email))}>
          {personInitials(employee)}
        </span>
        <div className="min-w-0 flex-1">
          <div
            className="overflow-hidden font-semibold text-ellipsis whitespace-nowrap"
            dir="auto"
          >
            {personName(employee)}
          </div>
          <div className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-(--Grey600)">
            {employee.email}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {employee.isFired ? (
            <span className={badgeClass("danger")}>
              {t("userControl.badges.fired")}
            </span>
          ) : !employee.isActive ? (
            <span className={badgeClass("warn")}>
              {t("userControl.badges.inactive")}
            </span>
          ) : null}
          {!employee.isAccountActive ? (
            <span className={badgeClass()}>
              {t("userControl.badges.pending")}
            </span>
          ) : null}
          {employee.isManager ? (
            <span
              className={badgeClass("violet")}
              title={t("userControl.badges.managerHint")}
            >
              {t("userControl.badges.manager")}
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-2.5 flex min-h-[26px] flex-wrap items-center gap-1.5">
        {roleStatus === "loading" ? (
          <AppSkeleton.Button active size="small" className="!h-6 !w-20 !min-w-20" />
        ) : null}
        {assigned.map((role) => (
          <RoleChip
            key={role.id}
            employeeId={employee.id}
            role={role}
            userControl={userControl}
          />
        ))}
        {roleStatus === "ready" && assigned.length === 0 && !employee.isManager ? (
          <span
            className={badgeClass("warn")}
            title={t("userControl.badges.noAccessHint")}
          >
            {t("userControl.badges.noAccess")}
          </span>
        ) : null}
        {userControl.canAssign ? (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center rounded-full border border-dashed border-(--Grey400) bg-transparent px-2.5 py-1 text-xs font-semibold text-(--Grey600)"
            onPointerDown={stopPointer}
            onClick={(event) => onPickRole(event.currentTarget)}
          >
            + {t("userControl.employees.addRole")}
          </button>
        ) : null}
      </div>
      {userControl.projectAccessStatus === "ready" ? (
        <div
          className="mt-2 overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-(--Grey500)"
          title={projects.map((project) => project.name).join(", ")}
        >
          {projects.length
            ? projects.map((project) => project.name).join(" · ")
            : t("userControl.employees.noProjects")}
        </div>
      ) : null}
    </article>
  );
};

type RoleChipProps = {
  employeeId: string;
  role: TApplicationRole;
  userControl: UserControlModel;
};

const RoleChip = ({ employeeId, role, userControl }: RoleChipProps) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `drag-chip:${employeeId}:${role.id}`,
    data: {
      type: "rolechip",
      userId: employeeId,
      roleId: role.id,
    } satisfies UserControlDragPayload,
    disabled: !userControl.canUnassign,
  });

  return (
    <span
      ref={setNodeRef}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border border-(--ta-accent) bg-(--ta-accent-soft) py-1 ps-2.5 pe-1.5 text-xs font-semibold text-(--ta-accent)",
        accentClass(role.name),
        isDragging && "opacity-40",
      )}
      {...attributes}
      {...listeners}
      onPointerDown={(event) => {
        event.stopPropagation();
        listeners?.onPointerDown?.(event);
      }}
    >
      {role.name}
      {userControl.canUnassign ? (
        <button
          type="button"
          className={iconButtonClass}
          aria-label={t("userControl.employees.unassign")}
          onPointerDown={stopPointer}
          onClick={() => void userControl.unassignRole(employeeId, role.id)}
        >
          ×
        </button>
      ) : null}
    </span>
  );
};

type RoleCardProps = {
  role: TApplicationRole;
  members: TEmployee[];
  userControl: UserControlModel;
  drag: UserControlDragPayload | null;
};

const RoleCard = ({ role, members, userControl, drag }: RoleCardProps) => {
  const { t } = useTranslation();
  const granted = userControl.permissionsReady.has(role.id)
    ? (userControl.rolePerms.get(role.id)?.size ?? 0)
    : role.permissionsCount;
  const total = userControl.permissionTotal || 1;
  const canDropUser = drag?.type === "user";
  const draggingPerm = drag?.type === "perm" || drag?.type === "group";
  const sharedReadOnly = role.isShared && draggingPerm;
  const canDropPerm =
    draggingPerm && !role.isShared && userControl.canSetPermissions;
  const showDropHover = canDropUser || canDropPerm || sharedReadOnly;
  const dropHint = canDropUser
    ? t("userControl.roles.dropAssign")
    : sharedReadOnly
      ? t("userControl.roles.dropShared")
      : drag?.type === "group"
        ? t("userControl.roles.dropGroup")
        : t("userControl.roles.dropPermission");
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `drag-role:${role.id}`,
    data: { type: "role", id: role.id } satisfies UserControlDragPayload,
    disabled: !userControl.canAssign,
  });
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-role:${role.id}`,
    data: {
      target: "role",
      roleId: role.id,
      isShared: role.isShared,
    } satisfies UserControlDropTarget,
    disabled: drag != null && !showDropHover,
  });
  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef],
  );

  return (
    <article
      ref={setNodeRef}
      className={clsx(
        "relative overflow-hidden rounded-[14px] border border-(--ta-accent) bg-(--ta-accent-soft) p-4",
        accentClass(role.name),
        dragOutline("user"),
        dragOutline("perm"),
        dragOutline("group"),
        isDragging && "opacity-40",
        isOver && showDropHover && "outline-2 outline-(--ta-accent)",
      )}
      {...attributes}
      {...listeners}
    >
      <span className="absolute inset-x-0 top-0 h-[3px] bg-(--ta-accent)" />
      <header className="flex items-center gap-2.5">
        <span className="size-2 rounded-full bg-(--ta-accent)" />
        <h3
          className="m-0 min-w-0 flex-1 overflow-hidden text-[15px] font-semibold text-ellipsis whitespace-nowrap"
          title={role.name}
        >
          {role.name}
        </h3>
        {role.isShared ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-(--ta-accent) px-2 py-[3px] text-[10px] font-semibold tracking-[0.04em] uppercase text-(--app-surface)"
            title={t("userControl.badges.sharedHint")}
          >
            <Lock size={10} aria-hidden />
            {t("userControl.badges.shared")}
          </span>
        ) : null}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            className={iconButtonClass}
            title={
              role.isShared
                ? t("userControl.roles.viewPermissions")
                : t("userControl.roles.managePermissions")
            }
            onPointerDown={stopPointer}
            onClick={() => userControl.openDrawer(role.id)}
          >
            <KeyRound size={15} aria-hidden />
          </button>
          {!role.isShared && userControl.canEditRole ? (
            <button
              type="button"
              className={iconButtonClass}
              title={t("userControl.roles.edit")}
              onPointerDown={stopPointer}
              onClick={() => userControl.openEditRole(role.id)}
            >
              <Pencil size={15} aria-hidden />
            </button>
          ) : null}
          {!role.isShared && userControl.canDeleteRole ? (
            <button
              type="button"
              className={iconButtonClass}
              title={t("userControl.roles.delete")}
              onPointerDown={stopPointer}
              onClick={() => userControl.requestDeleteRole(role.id)}
            >
              <Trash2 size={15} aria-hidden />
            </button>
          ) : null}
        </div>
      </header>
      <p
        className="my-2 mb-3.5 line-clamp-2 min-h-9 text-[13px] text-(--Grey600)"
        dir="auto"
      >
        {role.description || t("userControl.roles.noDescription")}
      </p>
      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-(--Grey100)">
          <span
            className="block h-full bg-(--ta-accent)"
            style={{ width: `${Math.round((granted / total) * 100)}%` }}
          />
        </div>
        <small className={faintClass}>
          {t("userControl.roles.coverage", {
            count: granted,
            total: userControl.permissionTotal,
          })}
        </small>
      </div>
      <footer className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap">
          {members.slice(0, 5).map((member, index) => (
            <span
              key={member.id}
              className={clsx(
                avatarClass(true),
                accentClass(member.email),
                index > 0 && "-ms-2",
              )}
              title={personName(member)}
            >
              {personInitials(member)}
            </span>
          ))}
        </div>
        <small className={faintClass}>
          {t(
            members.length === 1
              ? "userControl.roles.member"
              : "userControl.roles.members",
            {
              count: role.usersCount,
            },
          )}
        </small>
      </footer>
      <div
        className={clsx(
          "absolute inset-0 grid place-items-center bg-(--ta-accent) p-3 text-center font-bold text-(--app-surface) pointer-events-none",
          isOver && showDropHover ? "opacity-92" : "opacity-0",
        )}
      >
        {dropHint}
      </div>
    </article>
  );
};

type GroupSummaryProps = {
  groupName: string;
  count: number;
  userControl: UserControlModel;
};

const GroupSummary = ({ groupName, count, userControl }: GroupSummaryProps) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `drag-group:${groupName}`,
    data: { type: "group", id: groupName } satisfies UserControlDragPayload,
    disabled: !userControl.canSetPermissions,
  });

  return (
    <summary
      ref={setNodeRef}
      className={clsx(
        "flex cursor-grab items-center gap-2.5 px-3 py-[8px] font-bold text-sm!",
        accentClass(groupName),
        isDragging && "opacity-40",
      )}
      title={t("userControl.catalog.dragGroup")}
      {...attributes}
      {...listeners}
    >
      <span className="grid size-7 place-items-center rounded-[9px] bg-(--ta-accent) text-[11px] font-extrabold text-(--app-surface)">
        {groupName.slice(0, 2).toUpperCase()}
      </span>
      <span>{groupName}</span>
      <span className={countClass}>{count}</span>
    </summary>
  );
};

type PermissionRowProps = {
  actionId: number;
  userControl: UserControlModel;
  children: ReactNode;
};

const PermissionRow = ({
  actionId,
  userControl,
  children,
}: PermissionRowProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `drag-perm:${actionId}`,
    data: { type: "perm", id: actionId } satisfies UserControlDragPayload,
    disabled: !userControl.canSetPermissions,
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "mx-2 mb-2 flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 transition-colors hover:bg-(--app-surface)",
        isDragging && "opacity-40",
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

type CatalogProps = {
  userControl: UserControlModel;
  searching: boolean;
};

const Catalog = ({ userControl, searching }: CatalogProps) => {
  const { t } = useTranslation();
  const visible = userControl.catalogGroups.map((group) => ({
    group,
    actions: group.actions,
  }));

  return (
    <>
      {visible.map(({ group, actions }) => (
        <details
          key={`${group.name}:${searching ? "search" : "browse"}`}
          className="mb-2.5 overflow-hidden rounded-[14px] border border-(--Grey300) bg-(--Grey200)"
          open={searching ? true : undefined}
        >
          <GroupSummary
            groupName={group.name}
            count={group.actions.length}
            userControl={userControl}
          />
          {actions.map((action) => {
            const usedBy = userControl.roles.filter((role) =>
              userControl.rolePerms.get(role.id)?.has(action.id),
            );
            return (
              <PermissionRow
                key={action.id}
                actionId={action.id}
                userControl={userControl}
              >
                <div className="min-w-0 flex-1 cursor-grab">
                  <p className="m-0 mb-0.5 text-[13px] font-medium" dir="auto">
                    {permissionLabel(action)}
                  </p>
                  <code className="text-[11px] text-(--Grey600)">
                    {action.name}
                  </code>
                </div>
                <span
                  className="ms-auto flex items-center gap-0.75"
                  title={
                    usedBy.length === 0
                      ? t("userControl.catalog.unused")
                      : undefined
                  }
                >
                  {usedBy.slice(0, 6).map((role) => (
                    <Tooltip key={role.id} title={role.name}>
                      <span className="inline-flex p-0.5">
                        <i
                          className={clsx(
                            "size-2 rounded-full bg-(--ta-accent)",
                            accentClass(role.name),
                          )}
                        />
                      </span>
                    </Tooltip>
                  ))}
                </span>
              </PermissionRow>
            );
          })}
        </details>
      ))}
    </>
  );
};

export default UserControlBoard;
