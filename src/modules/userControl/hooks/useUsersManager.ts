import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";
import { triggerAnchorDownload } from "@/lib/files/triggerAnchorDownload";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useGetEmployees } from "../api/hooks/useGetEmployees";
import { useGetApplicationRoles } from "../api/hooks/useGetApplicationRoles";
import { useGetActiveProjects } from "../api/hooks/useGetActiveProjects";
import { readAllPages } from "../api/hooks/userControlPaging";
import { employeeQueryRootKey } from "../api/queryKeys/employeeQueryKeys";
import { applicationRoleQueryRootKey } from "../api/queryKeys/applicationRoleQueryKeys";
import { projectEmployeeQueryRootKey } from "../api/queryKeys/projectEmployeeQueryKeys";
import { applicationRoleService } from "../api/services/applicationRole.service";
import { employeeService } from "../api/services/employee.service";
import { projectEmployeeService } from "../api/services/projectEmployee.service";
import { ApplicationRoleVisibility } from "../types";
import type { TEmployee, TGetEmployeesParams } from "../types";
import type { TEmployeeFile } from "../types/employeeFiles";
import { USERS_MANAGER_TEMPORARY_STATS } from "../constants/usersManagerTemporaryStats";
import { readApiMessage } from "../utils/readApiMessage";

export type UsersManagerFileAction = {
  fileId: string;
  kind: "view" | "download";
};

export type UsersManagerFilter =
  | "all"
  | "active"
  | "blocked"
  | "fired"
  | "managers";

export type UsersManagerStatKey = keyof typeof USERS_MANAGER_TEMPORARY_STATS;

export const USERS_MANAGER_PAGE_SIZE = DEFAULT_PAGE_SIZE;

type PagedBody<T> = {
  isSuccess: boolean;
  data?: { data: T[]; totalCount: number } | null;
};

const readPages = <T>(pages: PagedBody<T>[] | undefined) =>
  (pages ?? []).flatMap((page) =>
    page.isSuccess && page.data ? page.data.data : [],
  );

const readTotal = <T>(pages: PagedBody<T>[] | undefined) => {
  const page = (pages ?? []).find((item) => item.isSuccess && item.data);
  return page?.data?.totalCount ?? 0;
};

const filterToParams = (filter: UsersManagerFilter): TGetEmployeesParams => {
  if (filter === "active") {
    return { isActive: true, isFired: false };
  }
  if (filter === "blocked") {
    return { isActive: false, isFired: false };
  }
  if (filter === "fired") {
    return { isFired: true };
  }
  if (filter === "managers") {
    return { isManager: true };
  }
  return {};
};

const statKeyToFilter = (
  key: UsersManagerStatKey,
): UsersManagerFilter => {
  if (key === "people") {
    return "all";
  }
  return key;
};

const loadMore = (query: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
}) => {
  if (!query.hasNextPage || query.isFetchingNextPage) {
    return;
  }
  void query.fetchNextPage();
};

export const useUsersManager = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { hasPermission, isAdmin, isManager, isLoading: permissionsLoading } =
    usePermissions();

  const canListEmployees =
    isAdmin || isManager || hasPermission(PermissionsList.Employee.Get);
  const enabled = isAuthenticated && companyId !== null && canListEmployees;
  const canListRoles = enabled && hasPermission(PermissionsList.ApplicationRole.Get);
  const canListProjects =
    enabled && hasPermission(PermissionsList.ProjectEmployee.GetActiveProjects);

  const [filter, setFilter] = useState<UsersManagerFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search.trim(), 300);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<TEmployee | null>(
    null,
  );
  const [hiring, setHiring] = useState(false);
  const [hireEmail, setHireEmail] = useState("");
  const [roleIds, setRoleIds] = useState<Set<string>>(new Set());
  const [projectIds, setProjectIds] = useState<Set<number>>(new Set());
  const [files, setFiles] = useState<TEmployeeFile[]>([]);
  const [crewId, setCrewId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [personLoading, setPersonLoading] = useState(false);
  const [fileAction, setFileAction] = useState<UsersManagerFileAction | null>(
    null,
  );

  const listParams = useMemo(
    () => ({
      pageSize: USERS_MANAGER_PAGE_SIZE,
      ...filterToParams(filter),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [debouncedSearch, filter],
  );

  const workspaceCatalogEnabled = hiring || selectedId !== null;

  const peopleQuery = useGetEmployees(listParams, enabled);

  const rolesQuery = useGetApplicationRoles(
    {
      pageSize: USERS_MANAGER_PAGE_SIZE,
      visibility: ApplicationRoleVisibility.All,
    },
    canListRoles && workspaceCatalogEnabled,
  );

  const projectsQuery = useGetActiveProjects(
    { pageSize: USERS_MANAGER_PAGE_SIZE },
    canListProjects,
  );

  const people = useMemo(
    () => readPages(peopleQuery.data?.pages),
    [peopleQuery.data?.pages],
  );

  const roles = useMemo(
    () => readPages(rolesQuery.data?.pages),
    [rolesQuery.data?.pages],
  );

  const projects = useMemo(
    () => readPages(projectsQuery.data?.pages),
    [projectsQuery.data?.pages],
  );

  const selectedPerson = useMemo(() => {
    if (!selectedId) {
      return null;
    }
    return (
      people.find((person) => person.id === selectedId) ??
      (selectedSnapshot?.id === selectedId ? selectedSnapshot : null)
    );
  }, [people, selectedId, selectedSnapshot]);

  const stats = USERS_MANAGER_TEMPORARY_STATS;

  const selectStat = (key: UsersManagerStatKey) => {
    setFilter(statKeyToFilter(key));
  };

  const activeCrewId = crewId ?? projects[0]?.id ?? null;
  const crewProject =
    projects.find((project) => project.id === activeCrewId) ?? null;

  const reloadCatalogs = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: employeeQueryRootKey }),
      queryClient.invalidateQueries({ queryKey: applicationRoleQueryRootKey }),
      queryClient.invalidateQueries({ queryKey: projectEmployeeQueryRootKey }),
    ]);
  }, [queryClient]);

  const loadPerson = useCallback(async (userId: string) => {
    setPersonLoading(true);
    try {
      const [rolesResult, assignedProjects, filesResult] = await Promise.all([
        applicationRoleService.getUserRoles(userId),
        readAllPages((page) =>
          projectEmployeeService.userProjects(userId, {
            page,
            pageSize: USERS_MANAGER_PAGE_SIZE,
          }),
        ),
        employeeService.getFiles(userId),
      ]);

      if (rolesResult.isSuccess && Array.isArray(rolesResult.data)) {
        setRoleIds(new Set(rolesResult.data.map((role) => role.id)));
      } else {
        setRoleIds(new Set());
      }

      setProjectIds(new Set(assignedProjects.map((project) => project.id)));

      if (filesResult.isSuccess && Array.isArray(filesResult.data)) {
        setFiles(filesResult.data);
      } else {
        setFiles([]);
      }
    } finally {
      setPersonLoading(false);
    }
  }, []);

  const selectPerson = async (userId: string) => {
    const person = people.find((row) => row.id === userId) ?? null;
    setHiring(false);
    setHireEmail("");
    setSelectedId(userId);
    setSelectedSnapshot(person);
    try {
      await loadPerson(userId);
    } catch (error) {
      toast.error(
        readApiMessage(error, t("userControl.usersManager.errors.openPerson")),
      );
    }
  };

  const startHiring = () => {
    setHiring(true);
    setSelectedId(null);
    setSelectedSnapshot(null);
    setHireEmail("");
    setRoleIds(new Set());
    setProjectIds(new Set());
    setFiles([]);
  };

  const toggleRole = (roleId: string) => {
    setRoleIds((current) => {
      const next = new Set(current);
      if (next.has(roleId)) {
        next.delete(roleId);
      } else {
        next.add(roleId);
      }
      return next;
    });
  };

  const toggleProject = (projectId: number) => {
    setProjectIds((current) => {
      const next = new Set(current);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      let userId = selectedId;
      if (hiring) {
        const email = hireEmail.trim();
        if (!email) {
          toast.error(t("userControl.usersManager.errors.emailRequired"));
          return;
        }
        const recruited = await employeeService.recruit({
          employeeEmail: email,
        });
        if (!recruited.isSuccess || !recruited.data) {
          toast.error(
            recruited.message || t("userControl.usersManager.errors.recruit"),
          );
          return;
        }
        userId = recruited.data;
      } else if (selectedPerson?.isFired && userId) {
        const hired = await employeeService.hire({ userId });
        if (!hired.isSuccess) {
          toast.error(
            hired.message || t("userControl.usersManager.errors.rehire"),
          );
          return;
        }
      }

      if (!userId) {
        return;
      }

      const rolesResult = await applicationRoleService.setUserRoles({
        userId,
        roleIds: [...roleIds],
      });
      if (!rolesResult.isSuccess) {
        toast.error(
          rolesResult.message || t("userControl.usersManager.errors.saveRoles"),
        );
        return;
      }

      const projectsResult = await projectEmployeeService.setUserProjects(
        userId,
        { userId, projectIds: [...projectIds] },
      );
      if (!projectsResult.isSuccess) {
        toast.error(
          projectsResult.message ||
            t("userControl.usersManager.errors.saveProjects"),
        );
        return;
      }

      setHiring(false);
      setHireEmail("");
      setSelectedId(userId);
      await reloadCatalogs();
      await loadPerson(userId);
      toast.success(t("userControl.usersManager.toast.saved"));
    } catch (error) {
      toast.error(
        readApiMessage(error, t("userControl.usersManager.errors.save")),
      );
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (
    kind: "block" | "unblock" | "fire" | "promote" | "demote",
  ) => {
    if (!selectedPerson) {
      return;
    }
    setBusy(true);
    try {
      const id = selectedPerson.id;
      if (kind === "block") {
        const result = await employeeService.deactivate(id);
        if (!result.isSuccess) {
          toast.error(
            result.message || t("userControl.usersManager.errors.block"),
          );
          return;
        }
      } else if (kind === "unblock") {
        const result = await employeeService.activate(id);
        if (!result.isSuccess) {
          toast.error(
            result.message || t("userControl.usersManager.errors.unblock"),
          );
          return;
        }
      } else if (kind === "fire") {
        const result = await employeeService.fire({ employeeId: id });
        if (!result.isSuccess) {
          toast.error(
            result.message || t("userControl.usersManager.errors.fire"),
          );
          return;
        }
      } else if (kind === "promote" || kind === "demote") {
        const result = await employeeService.setManager({
          userId: id,
          isManager: kind === "promote",
        });
        if (!result.isSuccess) {
          toast.error(
            result.message || t("userControl.usersManager.errors.manager"),
          );
          return;
        }
      }
      await reloadCatalogs();
      await loadPerson(id);
      toast.success(t("userControl.usersManager.toast.updated"));
    } catch (error) {
      toast.error(
        readApiMessage(error, t("userControl.usersManager.errors.action")),
      );
    } finally {
      setBusy(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!selectedId) {
      toast.error(t("userControl.usersManager.errors.chooseFile"));
      return;
    }
    setUploading(true);
    try {
      const result = await employeeService.uploadFile(selectedId, file);
      if (!result.isSuccess) {
        toast.error(
          result.message || t("userControl.usersManager.errors.upload"),
        );
        return;
      }
      await loadPerson(selectedId);
      toast.success(t("userControl.usersManager.toast.fileUploaded"));
    } catch (error) {
      toast.error(
        readApiMessage(error, t("userControl.usersManager.errors.upload")),
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!selectedId) {
      return;
    }
    setBusy(true);
    try {
      const result = await employeeService.deleteFile(fileId);
      if (!result.isSuccess) {
        toast.error(
          result.message || t("userControl.usersManager.errors.deleteFile"),
        );
        return;
      }
      await loadPerson(selectedId);
      toast.success(t("userControl.usersManager.toast.fileDeleted"));
    } catch (error) {
      toast.error(
        readApiMessage(error, t("userControl.usersManager.errors.fileAction")),
      );
    } finally {
      setBusy(false);
    }
  };

  const resolveFileUrl = async (file: TEmployeeFile) => {
    const result = await employeeService.downloadFile(file.fileId);
    if (!result.isSuccess || !result.data?.url) {
      return null;
    }
    return {
      url: result.data.url,
      fileName: file.fileName,
    };
  };

  const viewFile = async (file: TEmployeeFile) => {
    if (fileAction) {
      return;
    }
    setFileAction({ fileId: file.fileId, kind: "view" });
    try {
      const resolved = await resolveFileUrl(file);
      if (!resolved?.url) {
        toast.error(t("userControl.usersManager.errors.download"));
        return;
      }
      window.open(resolved.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(
        readApiMessage(error, t("userControl.usersManager.errors.download")),
      );
    } finally {
      setFileAction(null);
    }
  };

  const downloadFile = async (file: TEmployeeFile) => {
    if (fileAction) {
      return;
    }
    setFileAction({ fileId: file.fileId, kind: "download" });
    try {
      const resolved = await resolveFileUrl(file);
      if (!resolved?.url) {
        toast.error(t("userControl.usersManager.errors.download"));
        return;
      }
      triggerAnchorDownload(resolved.url, resolved.fileName);
    } catch (error) {
      toast.error(
        readApiMessage(error, t("userControl.usersManager.errors.download")),
      );
    } finally {
      setFileAction(null);
    }
  };

  const removeFromProject = async (userId: string, projectId: number) => {
    setBusy(true);
    try {
      const currentProjects = await readAllPages((page) =>
        projectEmployeeService.userProjects(userId, {
          page,
          pageSize: USERS_MANAGER_PAGE_SIZE,
        }),
      );
      const ids = currentProjects
        .map((project) => project.id)
        .filter((id) => id !== projectId);
      const result = await projectEmployeeService.setUserProjects(userId, {
        userId,
        projectIds: ids,
      });
      if (!result.isSuccess) {
        toast.error(
          result.message || t("userControl.usersManager.errors.removeProject"),
        );
        return;
      }
      if (userId === selectedId) {
        setProjectIds((current) => {
          const next = new Set(current);
          next.delete(projectId);
          return next;
        });
      }
      await reloadCatalogs();
      if (selectedId && !hiring) {
        await loadPerson(selectedId);
      }
      toast.success(t("userControl.usersManager.toast.removedFromProject"));
    } catch (error) {
      toast.error(
        readApiMessage(
          error,
          t("userControl.usersManager.errors.removeProject"),
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const reload = async () => {
    setBusy(true);
    try {
      await reloadCatalogs();
      if (selectedId && !hiring) {
        await loadPerson(selectedId);
      }
    } catch (error) {
      toast.error(
        readApiMessage(error, t("userControl.usersManager.errors.load")),
      );
    } finally {
      setBusy(false);
    }
  };

  const isLoading = permissionsLoading || (enabled && peopleQuery.isPending);

  return {
    canOpen: !permissionsLoading && canListEmployees,
    isLoading,
    busy: busy || personLoading,
    saving,
    uploading,
    stats,
    selectStat,
    filter,
    setFilter,
    search,
    setSearch,
    people,
    peopleTotal: readTotal(peopleQuery.data?.pages),
    peopleHasNext: Boolean(peopleQuery.hasNextPage),
    peopleFetchingNext: peopleQuery.isFetchingNextPage,
    loadMorePeople: () => loadMore(peopleQuery),
    roles,
    rolesHasNext: Boolean(rolesQuery.hasNextPage),
    rolesFetchingNext: rolesQuery.isFetchingNextPage,
    loadMoreRoles: () => loadMore(rolesQuery),
    projects,
    projectsHasNext: Boolean(projectsQuery.hasNextPage),
    projectsFetchingNext: projectsQuery.isFetchingNextPage,
    loadMoreProjects: () => loadMore(projectsQuery),
    selectedId,
    selectedPerson,
    hiring,
    hireEmail,
    setHireEmail,
    roleIds,
    projectIds,
    files,
    crewProject,
    activeCrewId,
    setCrewId,
    startHiring,
    selectPerson,
    toggleRole,
    toggleProject,
    saveAll,
    runAction,
    uploadFile,
    deleteFile,
    fileAction,
    viewFile,
    downloadFile,
    removeFromProject,
    reload,
  };
};

export type UsersManagerApi = ReturnType<typeof useUsersManager>;
