import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useGetEmployees } from "@/modules/userControl/api/hooks/useGetEmployees";
import { useCancelMyApprovalRequest } from "../api/hooks/useCancelMyApprovalRequest";
import { useGetApprovalEntityTypes } from "../api/hooks/useGetApprovalEntityTypes";
import { useGetMyApprovalRequestCounts } from "../api/hooks/useGetMyApprovalRequestCounts";
import { useGetMyApprovalRequests } from "../api/hooks/useGetMyApprovalRequests";
import { MY_APPROVAL_REQUESTS_PAGE_SIZE } from "../constants/myApprovalRequests";
import {
  MyApprovalRequestStatus,
  type TMyApprovalRequestStatus,
} from "../types/myApprovalRequest";
import { resolveMyApprovalStatusCode } from "../utils/myApprovalRequestMaps";

export const useMyApprovalRequests = () => {
  const { hasPermission } = usePermissions();
  const canGetEmployees = hasPermission(PermissionsList.Employee.Get);

  const [status, setStatus] = useState<TMyApprovalRequestStatus | "">("");
  const [entityType, setEntityType] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSame, setShowSame] = useState(false);
  const [cancelRequestId, setCancelRequestId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, searchKey: "" });
  const [debouncedSearch] = useDebounce(search.trim(), 300);
  const cancelMutation = useCancelMyApprovalRequest();

  const page =
    pagination.searchKey === debouncedSearch ? pagination.page : 1;

  const listParams = useMemo(
    () => ({
      page,
      pageSize: MY_APPROVAL_REQUESTS_PAGE_SIZE,
      sortDescending: true,
      ...(entityType ? { entityType } : {}),
      ...(status !== "" ? { status } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [debouncedSearch, entityType, page, status],
  );

  const countsParams = useMemo(
    () => ({
      ...(entityType ? { entityType } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [debouncedSearch, entityType],
  );

  const listQuery = useGetMyApprovalRequests(listParams);
  const countsQuery = useGetMyApprovalRequestCounts(countsParams);
  const entityTypesQuery = useGetApprovalEntityTypes();
  const employeesQuery = useGetEmployees(
    { pageSize: 200, isFired: false },
    canGetEmployees,
  );

  const items = useMemo(() => {
    const data = listQuery.data?.isSuccess ? listQuery.data.data : null;
    return data?.data ?? [];
  }, [listQuery.data]);

  const totalCount = listQuery.data?.isSuccess
    ? (listQuery.data.data?.totalCount ?? 0)
    : 0;

  const hasCountsData = countsQuery.data != null;
  const counts = useMemo(() => {
    const data = countsQuery.data?.isSuccess ? countsQuery.data.data : null;
    return {
      all: data?.all ?? 0,
      pending: data?.pending ?? 0,
      approved: data?.approved ?? 0,
      rejected: data?.rejected ?? 0,
      cancelled: data?.cancelled ?? 0,
    };
  }, [countsQuery.data]);

  const entityTypes = useMemo(() => {
    const data = entityTypesQuery.data?.isSuccess
      ? entityTypesQuery.data.data
      : null;
    return Array.isArray(data) ? data : [];
  }, [entityTypesQuery.data]);

  const nameByUserId = useMemo(() => {
    const map = new Map<string, string>();

    for (const item of items) {
      const names = item.userNames;
      if (!names || typeof names !== "object") {
        continue;
      }
      for (const [id, name] of Object.entries(names)) {
        if (id && name) {
          map.set(String(id).toLowerCase(), String(name));
        }
      }
    }

    const employeePages = employeesQuery.data?.pages ?? [];
    for (const pageResult of employeePages) {
      if (!pageResult.isSuccess || !pageResult.data?.data) {
        continue;
      }
      for (const employee of pageResult.data.data) {
        const name =
          [employee.firstName, employee.lastName].filter(Boolean).join(" ") ||
          employee.email ||
          employee.id;
        map.set(String(employee.id).toLowerCase(), name);
      }
    }

    return map;
  }, [employeesQuery.data?.pages, items]);

  const resolvePersonName = (userId: string | null | undefined) => {
    if (!userId) {
      return null;
    }
    return nameByUserId.get(String(userId).toLowerCase()) ?? userId;
  };

  const selectedRequest = useMemo(() => {
    if (!items.length) {
      return null;
    }
    return (
      items.find((item) => item.requestId === selectedId) ?? items[0] ?? null
    );
  }, [items, selectedId]);

  const activeSelectedId = selectedRequest?.requestId ?? null;

  const hasListData = listQuery.data != null;
  const isCountsInitialLoading = !hasCountsData && countsQuery.isPending;
  const isListFetching =
    listQuery.isFetching || (!hasListData && listQuery.isPending);
  const isFetching = listQuery.isFetching || countsQuery.isFetching;
  const isError =
    (listQuery.isError ||
      (listQuery.data != null && !listQuery.data.isSuccess) ||
      countsQuery.isError ||
      (countsQuery.data != null && !countsQuery.data.isSuccess)) &&
    !listQuery.isFetching &&
    !countsQuery.isFetching;

  const errorMessage =
    (listQuery.data && !listQuery.data.isSuccess
      ? listQuery.data.message
      : null) ||
    (countsQuery.data && !countsQuery.data.isSuccess
      ? countsQuery.data.message
      : null) ||
    null;

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / MY_APPROVAL_REQUESTS_PAGE_SIZE),
  );

  const setPage = (next: number) => {
    setPagination({ page: next, searchKey: debouncedSearch });
  };

  const setStatusFilter = (next: TMyApprovalRequestStatus | "") => {
    setStatus(next);
    setPagination({ page: 1, searchKey: debouncedSearch });
  };

  const setEntityTypeFilter = (next: string) => {
    setEntityType(next);
    setPagination({ page: 1, searchKey: debouncedSearch });
  };

  const reload = () => {
    void listQuery.refetch();
    void countsQuery.refetch();
    void entityTypesQuery.refetch();
  };

  const canCancelSelected =
    selectedRequest != null &&
    resolveMyApprovalStatusCode(selectedRequest.status) ===
      MyApprovalRequestStatus.Pending;

  const requestCancel = () => {
    if (!selectedRequest || !canCancelSelected) return;
    setCancelRequestId(selectedRequest.requestId);
  };

  const closeCancelConfirm = () => {
    if (cancelMutation.isPending) return;
    setCancelRequestId(null);
  };

  const confirmCancel = async () => {
    if (!cancelRequestId) return false;
    try {
      const response = await cancelMutation.mutateAsync(cancelRequestId);
      if (!response.isSuccess) return false;
      setCancelRequestId(null);
      return true;
    } catch {
      return false;
    }
  };

  return {
    page,
    setPage,
    status,
    setStatusFilter,
    entityType,
    setEntityTypeFilter,
    search,
    setSearch,
    selectedId: activeSelectedId,
    setSelectedId,
    showSame,
    setShowSame,
    items,
    totalCount,
    totalPages,
    counts,
    entityTypes,
    selectedRequest,
    resolvePersonName,
    canCancelSelected,
    cancelConfirmOpen: Boolean(cancelRequestId),
    requestCancel,
    closeCancelConfirm,
    confirmCancel,
    isCancelling: cancelMutation.isPending,
    isCountsInitialLoading,
    isListFetching,
    isFetching,
    isError,
    errorMessage,
    reload,
    pageSize: MY_APPROVAL_REQUESTS_PAGE_SIZE,
  };
};

export type MyApprovalRequestsApi = ReturnType<typeof useMyApprovalRequests>;
