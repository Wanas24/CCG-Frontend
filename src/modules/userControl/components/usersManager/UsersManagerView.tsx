import { useMemo, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router";
import { Modal } from "antd";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import {
  AppButton,
  AppDialog,
  AppDropDownSelect,
  AppInput,
  AppSkeleton,
  AppUpload,
} from "@/shared/ANTD_UIComponents";
import type { TEmployeeFile } from "../../types/employeeFiles";
import { USER_CONTROL_ROUTES } from "../../routes/paths";
import type { UsersManagerApi } from "../../hooks/useUsersManager";
import { personInitials, personName } from "../../utils/userControlDisplay";
import ScrollLoadSentinel from "../ScrollLoadSentinel";

type Props = {
  manager: UsersManagerApi;
};

const statusBadge = (person: {
  isActive: boolean;
  isFired: boolean;
  isManager: boolean;
}) => {
  if (person.isFired) {
    return "fired" as const;
  }
  if (!person.isActive) {
    return "blocked" as const;
  }
  return "active" as const;
};

const badgeClass = (kind: "active" | "blocked" | "fired" | "manager") => {
  if (kind === "active") {
    return "border-(--statusG200) text-(--statusG200)";
  }
  if (kind === "blocked") {
    return "border-(--statusY200) text-(--statusY200)";
  }
  if (kind === "fired") {
    return "border-(--statusR200) text-(--statusR200)";
  }
  return "border-(--Primary400) text-(--Primary400)";
};

const UsersManagerView = ({ manager }: Props) => {
  const { t } = useTranslation();
  const [pendingFileName, setPendingFileName] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<TEmployeeFile | null>(null);

  const filters = useMemo(
    () =>
      [
        ["all", "userControl.usersManager.filters.all"],
        ["active", "userControl.usersManager.filters.active"],
        ["blocked", "userControl.usersManager.filters.blocked"],
        ["fired", "userControl.usersManager.filters.fired"],
        ["managers", "userControl.usersManager.filters.managers"],
      ] as const,
    [],
  );

  const askConfirm = (title: string, content: string) =>
    new Promise<boolean>((resolve) => {
      Modal.confirm({
        title,
        content,
        okText: t("userControl.usersManager.confirm.confirm"),
        cancelText: t("userControl.usersManager.confirm.cancel"),
        okButtonProps: { danger: true },
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

  if (manager.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <AppSkeleton active paragraph={{ rows: 2 }} />
        <AppSkeleton active paragraph={{ rows: 8 }} />
        <p className={DesignTokens.typography.muted}>
          {t("userControl.usersManager.loading")}
        </p>
      </div>
    );
  }

  const selected = manager.selectedPerson;
  const selectedName = selected ? personName(selected) : "";

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className={clsx(DesignTokens.typography.headingSm, "text-2xl!")}>
            {t("userControl.usersManager.title")}
          </h1>
          <p className={clsx("m-0 mt-1", DesignTokens.typography.muted)}>
            {t("userControl.usersManager.subtitle")}
          </p>
        </div>
        <AppButton
          variant="secondary"
          icon={<RefreshCw size={16} />}
          loading={manager.busy}
          onClick={() => void manager.reload()}
        >
          {t("userControl.usersManager.reload")}
        </AppButton>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(
          [
            ["people", manager.stats.people],
            ["managers", manager.stats.managers],
            ["blocked", manager.stats.blocked],
            ["fired", manager.stats.fired],
          ] as const
        ).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => manager.selectStat(key)}
            className={clsx(
              "rounded-2xl border bg-(--app-surface) px-4 py-3.5 text-start",
              manager.filter === (key === "people" ? "all" : key)
                ? "border-(--Primary400)"
                : "border-(--Grey300)",
            )}
          >
            <small
              className={clsx(
                "text-[11px] font-bold uppercase tracking-wide",
                DesignTokens.typography.muted,
              )}
            >
              {t(`userControl.usersManager.stats.${key}`)}
            </small>
            <b className="mt-1 block text-2xl font-extrabold">{value}</b>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-3.5 xl:grid-cols-[18.75rem_minmax(0,1fr)_22.5rem]">
        <aside className="rounded-2xl border border-(--Grey300) bg-(--app-surface)">
          <div className="flex items-center gap-2 px-3.5 pt-3.5 pb-2">
            <h2 className={clsx(DesignTokens.typography.emphasis, "m-0 text-sm!")}>
              {t("userControl.usersManager.company")}
            </h2>
            <span className="rounded-full border border-(--Grey300) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
              {manager.peopleTotal}
            </span>
          </div>
          <div className="px-3 pb-2">
            <AppInput
              value={manager.search}
              onChange={(event) => manager.setSearch(event.target.value)}
              placeholder={t("userControl.usersManager.searchPlaceholder")}
              allowClear
            />
          </div>
          <div className="flex flex-wrap gap-1.5 px-3 pb-2">
            {filters.map(([id, labelKey]) => (
              <button
                key={id}
                type="button"
                onClick={() => manager.setFilter(id)}
                className={clsx(
                  "rounded-full border px-2.5 py-1 text-xs font-semibold",
                  manager.filter === id
                    ? "border-transparent bg-(--Primary400) text-(--app-surface)"
                    : "border-(--Grey300) text-(--Grey600)",
                )}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
          <div className="px-3 pb-2">
            <AppButton className="w-full!" onClick={manager.startHiring}>
              {t("userControl.usersManager.hire")}
            </AppButton>
          </div>
          <div className="flex max-h-[min(32rem,calc(100dvh-22rem))] flex-col gap-2 overflow-auto px-3 pb-3.5">
            {!manager.people.length ? (
              <p className={clsx("m-0 py-8 text-center", DesignTokens.typography.muted)}>
                {t("userControl.usersManager.emptyPeople")}
              </p>
            ) : (
              manager.people.map((person) => {
                const name = personName(person);
                const selectedCard =
                  person.id === manager.selectedId && !manager.hiring;
                const status = statusBadge(person);
                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => void manager.selectPerson(person.id)}
                    className={clsx(
                      "flex gap-2.5 rounded-xl border px-2.5 py-2.5 text-start",
                      selectedCard
                        ? "border-(--Primary400) bg-(--Primary100)"
                        : "border-(--Grey300) bg-(--Grey100)",
                    )}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-(--Primary400) text-xs font-extrabold text-(--app-surface)">
                      {personInitials(person)}
                    </span>
                    <span className="min-w-0">
                      <b className="block truncate text-[13px]">{name}</b>
                      <small className={clsx("block truncate", DesignTokens.typography.muted)}>
                        {person.email}
                      </small>
                      <span className="mt-1 flex flex-wrap gap-1">
                        {person.isManager ? (
                          <span
                            className={clsx(
                              "rounded-full border px-1.5 py-0.5 text-[10px] font-bold",
                              badgeClass("manager"),
                            )}
                          >
                            {t("userControl.usersManager.badges.manager")}
                          </span>
                        ) : null}
                        <span
                          className={clsx(
                            "rounded-full border px-1.5 py-0.5 text-[10px] font-bold",
                            badgeClass(status),
                          )}
                        >
                          {t(`userControl.usersManager.badges.${status}`)}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })
            )}
            <ScrollLoadSentinel
              hasMore={manager.peopleHasNext}
              loading={manager.peopleFetchingNext}
              onLoad={manager.loadMorePeople}
            />
          </div>
        </aside>

        <section className="min-h-[20rem] rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4">
          {manager.hiring ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3.5">
                <span className="grid size-13 place-items-center rounded-2xl bg-(--Primary400) text-lg font-extrabold text-(--app-surface)">
                  +
                </span>
                <div>
                  <h2 className={clsx(DesignTokens.typography.headingSm, "m-0 text-xl!")}>
                    {t("userControl.usersManager.hireTitle")}
                  </h2>
                  <p className={clsx("m-0 mt-1", DesignTokens.typography.muted)}>
                    {t("userControl.usersManager.hireSubtitle")}
                  </p>
                </div>
              </div>
              <div>
                <h3 className={clsx("m-0 mb-2 text-xs uppercase tracking-wide", DesignTokens.typography.muted)}>
                  {t("userControl.usersManager.email")}
                </h3>
                <AppInput
                  value={manager.hireEmail}
                  onChange={(event) => manager.setHireEmail(event.target.value)}
                  placeholder={t("userControl.usersManager.emailPlaceholder")}
                />
              </div>
              <RoleProjectPickers manager={manager} />
              <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-(--Grey300) bg-(--Primary100) p-3">
                <p className={clsx("m-0 flex-1 text-xs", DesignTokens.typography.muted)}>
                  {t("userControl.usersManager.saveHireHint")}
                </p>
                <AppButton
                  loading={manager.saving}
                  disabled={manager.busy || manager.uploading}
                  onClick={() => void manager.saveAll()}
                >
                  {t("userControl.usersManager.saveHire")}
                </AppButton>
              </div>
            </div>
          ) : !selected ? (
            <p className={clsx("m-0 py-16 text-center", DesignTokens.typography.muted)}>
              {t("userControl.usersManager.emptyWorkspace")}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3.5">
                <span className="grid size-13 place-items-center rounded-2xl bg-(--Primary400) text-lg font-extrabold text-(--app-surface)">
                  {personInitials(selected)}
                </span>
                <div className="min-w-0">
                  <h2 className={clsx(DesignTokens.typography.headingSm, "m-0 text-xl!")}>
                    {selectedName}
                  </h2>
                  <p className={clsx("m-0 mt-1", DesignTokens.typography.muted)}>
                    {selected.email}
                    {selected.phoneNumber ? ` · ${selected.phoneNumber}` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span
                      className={clsx(
                        "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                        selected.isManager
                          ? badgeClass("manager")
                          : "border-(--Grey300) text-(--Grey600)",
                      )}
                    >
                      {selected.isManager
                        ? t("userControl.usersManager.badges.manager")
                        : t("userControl.usersManager.employee")}
                    </span>
                    <span
                      className={clsx(
                        "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                        badgeClass(statusBadge(selected)),
                      )}
                    >
                      {t(
                        `userControl.usersManager.badges.${statusBadge(selected)}`,
                      )}
                    </span>
                    {selected.isDefaultManager ? (
                      <span className="rounded-full border border-(--Grey300) px-2 py-0.5 text-[10px] font-bold text-(--Grey600)">
                        {t("userControl.usersManager.defaultManager")}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {!selected.isFired ? (
                  selected.isActive ? (
                    <AppButton
                      variant="secondary"
                      disabled={selected.isDefaultManager || manager.busy}
                      onClick={async () => {
                        if (
                          await askConfirm(
                            t("userControl.usersManager.confirm.blockTitle", {
                              name: selectedName,
                            }),
                            t("userControl.usersManager.confirm.blockText"),
                          )
                        ) {
                          void manager.runAction("block");
                        }
                      }}
                    >
                      {t("userControl.usersManager.block")}
                    </AppButton>
                  ) : (
                    <AppButton
                      variant="secondary"
                      disabled={manager.busy}
                      onClick={() => void manager.runAction("unblock")}
                    >
                      {t("userControl.usersManager.unblock")}
                    </AppButton>
                  )
                ) : null}
                <AppButton
                  variant="delete"
                  disabled={
                    selected.isFired ||
                    selected.isDefaultManager ||
                    manager.busy
                  }
                  onClick={async () => {
                    if (
                      await askConfirm(
                        t("userControl.usersManager.confirm.fireTitle", {
                          name: selectedName,
                        }),
                        t("userControl.usersManager.confirm.fireText"),
                      )
                    ) {
                      void manager.runAction("fire");
                    }
                  }}
                >
                  {t("userControl.usersManager.fire")}
                </AppButton>
                {selected.isManager ? (
                  <AppButton
                    variant="secondary"
                    disabled={
                      selected.isDefaultManager ||
                      selected.isFired ||
                      !selected.isActive ||
                      manager.busy
                    }
                    onClick={async () => {
                      if (
                        await askConfirm(
                          t("userControl.usersManager.confirm.demoteTitle"),
                          t("userControl.usersManager.confirm.demoteText", {
                            name: selectedName,
                          }),
                        )
                      ) {
                        void manager.runAction("demote");
                      }
                    }}
                  >
                    {t("userControl.usersManager.removeManager")}
                  </AppButton>
                ) : (
                  <AppButton
                    variant="secondary"
                    disabled={
                      selected.isFired || !selected.isActive || manager.busy
                    }
                    onClick={() => void manager.runAction("promote")}
                  >
                    {t("userControl.usersManager.makeManager")}
                  </AppButton>
                )}
              </div>

              {selected.isFired ? (
                <p className="m-0 text-sm text-(--statusY200)">
                  {t("userControl.usersManager.rehireNotice")}
                </p>
              ) : null}

              <RoleProjectPickers manager={manager} />

              <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-(--Grey300) bg-(--Primary100) p-3">
                <p className={clsx("m-0 flex-1 text-xs", DesignTokens.typography.muted)}>
                  {selected.isFired
                    ? t("userControl.usersManager.saveRehireHint")
                    : t("userControl.usersManager.saveHint")}
                </p>
                <AppButton
                  loading={manager.saving}
                  disabled={manager.busy || manager.uploading}
                  onClick={() => void manager.saveAll()}
                >
                  {selected.isFired
                    ? t("userControl.usersManager.saveRehire")
                    : t("userControl.usersManager.saveRoles")}
                </AppButton>
              </div>
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-3.5">
          <section className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-3.5">
            <h2 className={clsx(DesignTokens.typography.emphasis, "m-0 text-sm!")}>
              {t("userControl.usersManager.filesTitle")}
            </h2>
            {!selected || manager.hiring ? (
              <p className={clsx("m-0 mt-3 py-6 text-center", DesignTokens.typography.muted)}>
                {t("userControl.usersManager.selectFiles")}
              </p>
            ) : (
              <>
                <p className={clsx("m-0 mt-1.5 text-xs", DesignTokens.typography.muted)}>
                  {t("userControl.usersManager.filesHint")}
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  <AppUpload
                    maxCount={1}
                    showUploadList={false}
                    disabled={manager.uploading || manager.busy || manager.saving}
                    beforeUpload={(selectedFile) => {
                      setPendingFileName(selectedFile.name);
                      void manager.uploadFile(selectedFile).finally(() => {
                        setPendingFileName(null);
                      });
                      return false;
                    }}
                  >
                    <AppButton
                      variant="secondary"
                      htmlType="button"
                      loading={manager.uploading}
                      disabled={manager.uploading || manager.busy || manager.saving}
                    >
                      {t("userControl.usersManager.upload")}
                    </AppButton>
                  </AppUpload>
                  {pendingFileName ? (
                    <p
                      className={clsx(
                        "m-0 truncate text-xs",
                        DesignTokens.typography.muted,
                      )}
                    >
                      {pendingFileName}
                    </p>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {!manager.files.length ? (
                    <p className={clsx("m-0 py-4 text-center", DesignTokens.typography.muted)}>
                      {t("userControl.usersManager.emptyFiles")}
                    </p>
                  ) : (
                    manager.files.map((item) => (
                      <div
                        key={item.fileId}
                        className="rounded-xl border border-(--Grey300) bg-(--Grey100) p-2.5"
                      >
                        <b className="text-sm">{item.fileName}</b>
                        {item.description ? (
                          <p className={clsx("m-0 mt-1 text-xs", DesignTokens.typography.muted)}>
                            {item.description}
                          </p>
                        ) : null}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <AppButton
                            variant="secondary"
                            loading={
                              manager.fileAction?.fileId === item.fileId &&
                              manager.fileAction.kind === "view"
                            }
                            disabled={Boolean(manager.fileAction)}
                            onClick={() => void manager.viewFile(item)}
                          >
                            {t("userControl.usersManager.preview")}
                          </AppButton>
                          <AppButton
                            variant="secondary"
                            loading={
                              manager.fileAction?.fileId === item.fileId &&
                              manager.fileAction.kind === "download"
                            }
                            disabled={Boolean(manager.fileAction)}
                            onClick={() => void manager.downloadFile(item)}
                          >
                            {t("userControl.usersManager.download")}
                          </AppButton>
                          <AppButton
                            variant="delete"
                            disabled={Boolean(manager.fileAction)}
                            onClick={() => setDeletingFile(item)}
                          >
                            {t("userControl.usersManager.delete")}
                          </AppButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </section>

          <section className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-3.5">
            <h2 className={clsx(DesignTokens.typography.emphasis, "m-0 mb-2 text-sm!")}>
              {t("userControl.usersManager.crewTitle")}
            </h2>
            {!manager.projects.length ? (
              <p className={clsx("m-0 py-6 text-center", DesignTokens.typography.muted)}>
                {t("userControl.usersManager.emptyProjects")}
              </p>
            ) : (
              <>
                <AppDropDownSelect
                  value={manager.activeCrewId ?? undefined}
                  options={manager.projects.map((project) => ({
                    value: project.id,
                    label: `${project.name} (${project.users.length})`,
                  }))}
                  onChange={(value) =>
                    manager.setCrewId(typeof value === "number" ? value : null)
                  }
                />
                {manager.projectsHasNext ? (
                  <AppButton
                    variant="tertiary"
                    className="mt-1!"
                    loading={manager.projectsFetchingNext}
                    onClick={manager.loadMoreProjects}
                  >
                    {t("userControl.usersManager.loadMoreProjects")}
                  </AppButton>
                ) : null}
                <div className="mt-2 flex max-h-64 flex-col overflow-auto">
                  {!manager.crewProject?.users.length ? (
                    <p className={clsx("m-0 py-6 text-center", DesignTokens.typography.muted)}>
                      {t("userControl.usersManager.emptyCrew")}
                    </p>
                  ) : (
                    manager.crewProject.users.map((user) => {
                      const name = personName(user);
                      return (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 border-b border-(--Grey300) py-2 last:border-b-0"
                        >
                          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-(--Primary400) text-[11px] font-extrabold text-(--app-surface)">
                            {personInitials(user)}
                          </span>
                          <b className="min-w-0 flex-1 truncate text-sm">{name}</b>
                          <AppButton
                            variant="delete"
                            onClick={async () => {
                              if (
                                !manager.crewProject ||
                                !(await askConfirm(
                                  t(
                                    "userControl.usersManager.confirm.removeProjectTitle",
                                  ),
                                  t(
                                    "userControl.usersManager.confirm.removeProjectText",
                                  ),
                                ))
                              ) {
                                return;
                              }
                              void manager.removeFromProject(
                                user.id,
                                manager.crewProject.id,
                              );
                            }}
                          >
                            {t("userControl.usersManager.remove")}
                          </AppButton>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </section>
        </aside>
      </div>

      <AppDialog
        open={Boolean(deletingFile)}
        title={t("userControl.usersManager.confirm.deleteFileTitle")}
        onCancel={() => setDeletingFile(null)}
        footer={null}
        destroyOnHidden
      >
        <p className="m-0 text-sm text-(--Grey600)">
          {t("userControl.usersManager.confirm.deleteFileText")}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <AppButton
            variant="secondary"
            onClick={() => setDeletingFile(null)}
          >
            {t("userControl.usersManager.confirm.cancel")}
          </AppButton>
          <AppButton
            variant="delete"
            loading={manager.busy}
            onClick={() => {
              if (!deletingFile) {
                return;
              }
              const fileId = deletingFile.fileId;
              setDeletingFile(null);
              void manager.deleteFile(fileId);
            }}
          >
            {t("userControl.usersManager.delete")}
          </AppButton>
        </div>
      </AppDialog>
    </div>
  );
};

type PickersProps = {
  manager: UsersManagerApi;
};

const RoleProjectPickers = ({ manager }: PickersProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mt-1 flex items-baseline gap-2">
        <h3 className={clsx("m-0 text-xs uppercase tracking-wide", DesignTokens.typography.muted)}>
          {t("userControl.usersManager.roles")}
        </h3>
        <Link
          to={USER_CONTROL_ROUTES.userControl}
          className="ms-auto text-xs font-bold text-(--Primary400) no-underline"
        >
          {t("userControl.usersManager.editRolePermissions")}
        </Link>
      </div>
      <div className="max-h-52 overflow-auto">
        <div className="flex flex-wrap gap-2">
          {!manager.roles.length ? (
            <p className={clsx("m-0 py-4", DesignTokens.typography.muted)}>
              {t("userControl.usersManager.emptyRoles")}
            </p>
          ) : (
            manager.roles.map((role) => {
              const on = manager.roleIds.has(role.id);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => manager.toggleRole(role.id)}
                  className={clsx(
                    "rounded-xl border px-2.5 py-2 text-start text-[13px] font-semibold",
                    on
                      ? "border-(--Primary400) bg-(--Primary100)"
                      : "border-(--Grey300) bg-(--Grey100)",
                  )}
                >
                  {role.name}
                  <small className={clsx("block font-medium", DesignTokens.typography.muted)}>
                    {role.isShared
                      ? t("userControl.usersManager.shared")
                      : t("userControl.usersManager.companyRole")}
                  </small>
                </button>
              );
            })
          )}
        </div>
        <ScrollLoadSentinel
          hasMore={manager.rolesHasNext}
          loading={manager.rolesFetchingNext}
          onLoad={manager.loadMoreRoles}
        />
      </div>

      <h3 className={clsx("m-0 mt-2 text-xs uppercase tracking-wide", DesignTokens.typography.muted)}>
        {t("userControl.usersManager.projects")}
      </h3>
      <div className="max-h-52 overflow-auto">
        <div className="flex flex-wrap gap-2">
          {!manager.projects.length ? (
            <p className={clsx("m-0 py-4", DesignTokens.typography.muted)}>
              {t("userControl.usersManager.emptyProjects")}
            </p>
          ) : (
            manager.projects.map((project) => {
              const on = manager.projectIds.has(project.id);
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => manager.toggleProject(project.id)}
                  className={clsx(
                    "rounded-xl border px-2.5 py-2 text-start text-[13px] font-semibold",
                    on
                      ? "border-(--Primary400) bg-(--Primary100)"
                      : "border-(--Grey300) bg-(--Grey100)",
                  )}
                >
                  {project.name}
                  <small className={clsx("block font-medium", DesignTokens.typography.muted)}>
                    {project.number || t("userControl.usersManager.projectLabel")}
                  </small>
                </button>
              );
            })
          )}
        </div>
        <ScrollLoadSentinel
          hasMore={manager.projectsHasNext}
          loading={manager.projectsFetchingNext}
          onLoad={manager.loadMoreProjects}
        />
      </div>
    </>
  );
};

export default UsersManagerView;
