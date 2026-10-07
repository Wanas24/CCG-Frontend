import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBlocker, type BlockerFunction } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getSimpleResultFromAxiosError } from "@/lib/api/applyApiFieldErrors";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useCheckLastUsedLayout, usePreviewReportLayout } from "../api/hooks/usePreviewReportLayout";
import { useCreateReportLayout } from "../api/hooks/useCreateReportLayout";
import { useDeactivateReportLayout } from "../api/hooks/useDeactivateReportLayout";
import { useGetReportLayouts } from "../api/hooks/useGetReportLayouts";
import { useGetReportLayoutSummary } from "../api/hooks/useGetReportLayoutSummary";
import { useLoadReportLayout } from "../api/hooks/useLoadReportLayout";
import { useUpdateReportLayout } from "../api/hooks/useUpdateReportLayout";
import { reportLayoutQueryRootKey } from "../api/queryKeys/reportLayoutQueryKeys";
import { layoutIdentitySchema } from "../schemas/layoutIdentitySchema";
import { LAYOUT_LIMITS } from "../schemas/layoutLimits";
import {
  COMPANY_LAYOUT_LIMIT,
  CONTENT_KIND,
  REPORT_TYPES,
  type TContentKind,
  type TLastUsedResult,
  type TLayout,
  type TLayoutDraft,
  type TLayoutInput,
  type TPreviewInput,
  type TSignatureDraft,
} from "../types";
import { buildLayoutChanges } from "../utils/layoutDiff";
import { buildLayoutChecks } from "../utils/layoutChecks";
import { cloneDraft, createBlankDraft, createSignature } from "../utils/layoutDefaults";
import { LAYOUT_PRESETS, type TPresetKey } from "../utils/layoutPresets";
import {
  activeCompanyCount,
  nextFreeCode,
  suffixCopy,
  toDraft,
  toLayoutInput,
  toStoredLayoutInput,
} from "../utils/layoutPayload";
import { layoutText } from "../utils/layoutText";
import { SECTION_IDS } from "../utils/layoutFields";

export type TStudioView = "gallery" | "designer" | "usage";
export type TCanvasMode = "mock" | "pdf";
export type TZoom = "fit" | "fitw" | "0.5" | "0.75" | "1" | "1.5";

export type TUsageEntry =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; layout: TLayout }
  | { status: "empty" }
  | { status: "error"; message: string };

export type TSaveDraft = {
  code: string;
  name: string;
  isDefault: boolean;
};

export type TConfirmState = {
  title: string;
  body: string;
  confirmLabel: string;
  danger: boolean;
};

const INITIAL_SECTIONS = new Set<string>(["identity", "page", "header"]);

const emptyToNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const useReportLayoutStudio = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isAdmin, isManager, hasPermission } = usePermissions();
  const allow = useCallback(
    (permission: string) => isAdmin || isManager || hasPermission(permission),
    [hasPermission, isAdmin, isManager],
  );

  const permissions = useMemo(
    () => ({
      canGet: allow(PermissionsList.ReportLayout.GetById),
      canCreate: allow(PermissionsList.ReportLayout.Create),
      canUpdate: allow(PermissionsList.ReportLayout.Update),
      canDeactivate: allow(PermissionsList.ReportLayout.Deactivate),
      canPreview: allow(PermissionsList.ReportLayout.PreviewSample),
      canLastUsed: allow(PermissionsList.ReportLayout.GetLastUsedLayout),
    }),
    [allow],
  );

  const [view, setView] = useState<TStudioView>("gallery");
  const [includeInactive, setIncludeInactive] = useState(true);
  const [draft, setDraft] = useState<TLayoutDraft>(() => createBlankDraft());
  const [baseline, setBaseline] = useState<TLayoutDraft | null>(null);
  const [editing, setEditing] = useState<{ id: string; isSystem: boolean } | null>(null);
  const [inspectorQuery, setInspectorQuery] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(INITIAL_SECTIONS));
  const [canvas, setCanvas] = useState<TCanvasMode>("mock");
  const [zoom, setZoom] = useState<TZoom>("fit");
  const [guides, setGuides] = useState(true);
  const [sampleTitle, setSampleTitle] = useState("");
  const [sampleSubtitle, setSampleSubtitle] = useState("");
  const [contentKind, setContentKind] = useState<TContentKind>(CONTENT_KIND.Table);
  const [autoPdf, setAutoPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [renderedKey, setRenderedKey] = useState<string | null>(null);
  const [saveDraft, setSaveDraft] = useState<TSaveDraft | null>(null);
  const [confirm, setConfirm] = useState<TConfirmState | null>(null);
  const [usage, setUsage] = useState<Record<string, TUsageEntry>>({});
  const [customType, setCustomType] = useState("");
  const [isOpening, setIsOpening] = useState(false);

  const listQuery = useGetReportLayouts(includeInactive);
  const summaryQuery = useGetReportLayoutSummary(includeInactive);
  const loadLayout = useLoadReportLayout();
  const createMutation = useCreateReportLayout();
  const updateMutation = useUpdateReportLayout();
  const deactivateMutation = useDeactivateReportLayout();
  const { preview } = usePreviewReportLayout();
  const { check } = useCheckLastUsedLayout();

  const layouts = useMemo(
    () => (listQuery.data?.isSuccess ? (listQuery.data.data ?? []) : []),
    [listQuery.data],
  );
  const summary = useMemo(
    () => (summaryQuery.data?.isSuccess ? (summaryQuery.data.data ?? null) : null),
    [summaryQuery.data],
  );
  const loadError = listQuery.data && !listQuery.data.isSuccess
    ? listQuery.data.message
    : listQuery.isError
      ? (getSimpleResultFromAxiosError(listQuery.error)?.message ?? t("reportLayout.loadFailed"))
      : null;

  const checks = useMemo(
    () =>
      buildLayoutChecks({
        draft,
        layouts,
        editingId: editing?.id ?? null,
        editingIsSystem: editing?.isSystem ?? false,
        contentKind,
        t,
      }),
    [contentKind, draft, editing?.id, editing?.isSystem, layouts, t],
  );
  const changes = useMemo(
    () => buildLayoutChanges(baseline, draft, t),
    [baseline, draft, t],
  );
  const blockingCount = checks.filter((checkItem) => checkItem.level === "err").length;
  const draftRef = useRef(draft);
  const sampleTitleRef = useRef(sampleTitle);
  const sampleSubtitleRef = useRef(sampleSubtitle);
  const contentKindRef = useRef(contentKind);
  useEffect(() => {
    draftRef.current = draft;
    sampleTitleRef.current = sampleTitle;
    sampleSubtitleRef.current = sampleSubtitle;
    contentKindRef.current = contentKind;
  }, [contentKind, draft, sampleSubtitle, sampleTitle]);
  const exportedLayout = useMemo(
    () => (pdfUrl ? toLayoutInput(draft) : null),
    [draft, pdfUrl],
  );
  const previewKey = useMemo(() => {
    if (!pdfUrl || !exportedLayout) return null;
    return JSON.stringify({
      title: emptyToNull(sampleTitle),
      subtitle: emptyToNull(sampleSubtitle),
      contentKind,
      layout: exportedLayout,
    });
  }, [contentKind, exportedLayout, pdfUrl, sampleSubtitle, sampleTitle]);
  const pdfStale = Boolean(pdfUrl) && renderedKey !== null && renderedKey !== previewKey;

  const confirmActionRef = useRef<(() => void) | null>(null);
  const confirmKindRef = useRef<"action" | "nav" | null>(null);
  const navPromptRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const previewRequestRef = useRef(0);
  const pdfUrlRef = useRef<string | null>(null);
  const editingRef = useRef(editing);
  const dirtyRef = useRef(false);

  useEffect(() => {
    editingRef.current = editing;
    dirtyRef.current = changes.length > 0;
  }, [changes.length, editing]);

  const replacePdfUrl = useCallback((next: string | null) => {
    if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    pdfUrlRef.current = next;
    setPdfUrl(next);
  }, []);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    },
    [],
  );

  useEffect(() => {
    if (changes.length === 0) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [changes.length]);

  const beginDraft = useCallback((next: TLayoutDraft, nextEditing: { id: string; isSystem: boolean } | null) => {
    setDraft(next);
    setBaseline(cloneDraft(next));
    setEditing(nextEditing);
    setView("designer");
    setCanvas("mock");
    setPdfError(null);
  }, []);

  const askConfirm = useCallback((state: TConfirmState, action: () => void) => {
    confirmKindRef.current = "action";
    confirmActionRef.current = action;
    setConfirm(state);
  }, []);

  const runUnlessDirty = useCallback(
    (action: () => void) => {
      if (!dirtyRef.current) {
        action();
        return;
      }
      askConfirm(
        {
          title: t("reportLayout.confirm.discardTitle"),
          body: t("reportLayout.confirm.discardBody"),
          confirmLabel: t("reportLayout.confirm.discardAction"),
          danger: true,
        },
        action,
      );
    },
    [askConfirm, t],
  );

  const forgetMissing = useCallback(
    async (message?: string) => {
      toast.error(message || t("reportLayout.toast.gone"));
      await queryClient.invalidateQueries({ queryKey: reportLayoutQueryRootKey });
    },
    [queryClient, t],
  );

  const openStoredLayout = useCallback(
    async (layoutId: string) => {
      setIsOpening(true);
      try {
        const result = await loadLayout(layoutId);
        if (!result.isSuccess || !result.data) {
          await forgetMissing(result.message);
          return;
        }
        beginDraft(toDraft(result.data), {
          id: result.data.id,
          isSystem: result.data.isSystem,
        });
        toast.success(
          result.data.isSystem
            ? t("reportLayout.toast.openedSystem")
            : result.message || t("reportLayout.toast.opened"),
        );
      } catch (error) {
        await forgetMissing(getSimpleResultFromAxiosError(error)?.message);
      } finally {
        setIsOpening(false);
      }
    },
    [beginDraft, forgetMissing, loadLayout, t],
  );

  const openLayout = useCallback(
    (layoutId: string) => {
      if (!permissions.canGet) return;
      runUnlessDirty(() => {
        void openStoredLayout(layoutId);
      });
    },
    [openStoredLayout, permissions.canGet, runUnlessDirty],
  );

  const duplicateStoredLayout = useCallback(
    async (layoutId: string) => {
      setIsOpening(true);
      try {
        const result = await loadLayout(layoutId);
        if (!result.isSuccess || !result.data) {
          await forgetMissing(result.message);
          return;
        }
        const next = toDraft(result.data);
        next.code = nextFreeCode(
          suffixCopy(next.code, LAYOUT_LIMITS.code, "_COPY"),
          layouts,
        );
        next.name = suffixCopy(next.name, LAYOUT_LIMITS.name, " (copy)");
        next.isDefault = false;
        next.isActive = true;
        beginDraft(next, null);
        toast.info(t("reportLayout.toast.duplicated"));
      } catch (error) {
        await forgetMissing(getSimpleResultFromAxiosError(error)?.message);
      } finally {
        setIsOpening(false);
      }
    },
    [beginDraft, forgetMissing, layouts, loadLayout, t],
  );

  const duplicateLayout = useCallback(
    (layoutId: string) => {
      if (!permissions.canGet) return;
      runUnlessDirty(() => {
        void duplicateStoredLayout(layoutId);
      });
    },
    [duplicateStoredLayout, permissions.canGet, runUnlessDirty],
  );

  const startBlank = useCallback(
    (presetKey: TPresetKey | null) => {
      const next = createBlankDraft();
      const preset = presetKey ? LAYOUT_PRESETS[presetKey] : null;
      if (preset) Object.assign(next, preset.patch);
      next.code = nextFreeCode(
        preset ? preset.code : `TENANT_CUSTOM_${layouts.length + 1}`,
        layouts,
      );
      next.name = preset
        ? layoutText(t, preset.labelKey)
        : t("reportLayout.editor.newTitle");
      next.isDefault = false;
      next.isActive = true;
      beginDraft(next, null);
      toast.info(
        preset
          ? t("reportLayout.toast.preset", { name: layoutText(t, preset.labelKey) })
          : t("reportLayout.toast.blank"),
      );
    },
    [beginDraft, layouts, t],
  );

  const startNew = useCallback(
    (presetKey: TPresetKey | null) => {
      if (!permissions.canCreate) return;
      if (activeCompanyCount(layouts) >= COMPANY_LAYOUT_LIMIT) {
        toast.warn(t("reportLayout.toast.quota"));
        return;
      }
      runUnlessDirty(() => startBlank(presetKey));
    },
    [layouts, permissions.canCreate, runUnlessDirty, startBlank, t],
  );

  const duplicateDraft = useCallback(() => {
    if (!baseline) return;
    setEditing(null);
    setDraft((current) => ({
      ...current,
      code: nextFreeCode(
        suffixCopy(current.code, LAYOUT_LIMITS.code, "_COPY"),
        layouts,
      ),
      name: suffixCopy(current.name, LAYOUT_LIMITS.name, " (copy)"),
      isDefault: false,
    }));
    toast.info(t("reportLayout.toast.detached"));
  }, [baseline, layouts, t]);

  const patchDraft = useCallback((patch: Partial<TLayoutDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const patchSignature = useCallback((uid: string, patch: Partial<TSignatureDraft>) => {
    setDraft((current) => ({
      ...current,
      signatures: current.signatures.map((signature) =>
        signature.uid === uid ? { ...signature, ...patch } : signature,
      ),
    }));
  }, []);

  const addSignature = useCallback(() => {
    setDraft((current) => ({
      ...current,
      signatures: [
        ...current.signatures,
        createSignature(current.signatures.length + 1),
      ],
    }));
  }, []);

  const removeSignature = useCallback((uid: string) => {
    setDraft((current) => ({
      ...current,
      signatures: current.signatures
        .filter((signature) => signature.uid !== uid)
        .map((signature, index) => ({ ...signature, displayOrder: index + 1 })),
    }));
  }, []);

  const moveSignature = useCallback((uid: string, direction: -1 | 1) => {
    setDraft((current) => {
      const index = current.signatures.findIndex((signature) => signature.uid === uid);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.signatures.length) return current;
      const signatures = [...current.signatures];
      const [item] = signatures.splice(index, 1);
      signatures.splice(target, 0, item);
      return {
        ...current,
        signatures: signatures.map((signature, order) => ({
          ...signature,
          displayOrder: order + 1,
        })),
      };
    });
  }, []);

  const revert = useCallback(() => {
    if (!baseline) return;
    setDraft(cloneDraft(baseline));
  }, [baseline]);

  const toggleSection = useCallback((id: string, open: boolean) => {
    setOpenSections((current) => {
      if (current.has(id) === open) return current;
      const next = new Set(current);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setOpenSections(new Set(SECTION_IDS));
  }, []);

  const collapseAll = useCallback(() => {
    setOpenSections(new Set());
  }, []);

  const runPreview = useCallback(
    async (switchCanvas: boolean) => {
      if (!permissions.canPreview) return;
      const requestId = previewRequestRef.current + 1;
      previewRequestRef.current = requestId;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const isCurrent = () => previewRequestRef.current === requestId;
      if (switchCanvas) setCanvas("pdf");
      setPdfLoading(true);
      setPdfError(null);
      const body: TPreviewInput = {
        title: emptyToNull(sampleTitleRef.current),
        subtitle: emptyToNull(sampleSubtitleRef.current),
        contentKind: contentKindRef.current,
        layout: toLayoutInput(draftRef.current),
      };
      try {
        const result = await preview(body, controller.signal);
        if (!isCurrent()) return;
        if (controller.signal.aborted) {
          setPdfLoading(false);
          return;
        }
        if (!result.ok) {
          setAutoPdf(false);
          setPdfError(result.message || t("reportLayout.preview.failed"));
          setPdfLoading(false);
          if (!switchCanvas) setCanvas("pdf");
          return;
        }
        replacePdfUrl(URL.createObjectURL(result.blob));
        setRenderedKey(JSON.stringify(body));
        setPdfLoading(false);
      } catch (error) {
        if (!isCurrent()) return;
        if (controller.signal.aborted) {
          setPdfLoading(false);
          return;
        }
        setAutoPdf(false);
        setPdfError(
          getSimpleResultFromAxiosError(error)?.message || t("reportLayout.preview.failed"),
        );
        setPdfLoading(false);
        setCanvas("pdf");
      }
    },
    [permissions.canPreview, preview, replacePdfUrl, t],
  );

  useEffect(() => {
    if (!autoPdf || !permissions.canPreview || !baseline) return;
    const timer = window.setTimeout(() => {
      void runPreview(false);
    }, 700);
    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [
    autoPdf,
    baseline,
    contentKind,
    draft,
    permissions.canPreview,
    runPreview,
    sampleSubtitle,
    sampleTitle,
  ]);

  const updateLayout = useCallback(() => {
    const currentEditing = editing;
    if (!currentEditing || currentEditing.isSystem || !permissions.canUpdate) return;
    if (blockingCount > 0) {
      toast.warn(t("reportLayout.toast.fixIssues"));
      return;
    }
    updateMutation.mutate(
      { layoutId: currentEditing.id, body: toLayoutInput(draft) },
      {
        onSuccess: (result) => {
          if (!result.isSuccess || !result.data) return;
          beginDraft(toDraft(result.data), {
            id: result.data.id,
            isSystem: result.data.isSystem,
          });
          toast.success(result.message || t("reportLayout.toast.updated"));
        },
      },
    );
  }, [beginDraft, blockingCount, draft, editing, permissions.canUpdate, t, updateMutation]);

  const openSaveAsNew = useCallback(() => {
    if (!permissions.canCreate || !baseline) return;
    if (activeCompanyCount(layouts) >= COMPANY_LAYOUT_LIMIT) {
      toast.warn(t("reportLayout.toast.quota"));
      return;
    }
    setSaveDraft({
      code: nextFreeCode(draft.code || "TENANT_CUSTOM", layouts),
      name: (draft.name || t("reportLayout.editor.newTitle")).slice(0, LAYOUT_LIMITS.name),
      isDefault: draft.isDefault,
    });
  }, [baseline, draft.code, draft.isDefault, draft.name, layouts, permissions.canCreate, t]);

  const submitSave = useCallback(
    (values: TSaveDraft) => {
      const parsed = layoutIdentitySchema.safeParse(values);
      if (!parsed.success) {
        toast.warn(t("reportLayout.save.invalid"));
        return;
      }
      const next = {
        ...draft,
        code: parsed.data.code,
        name: parsed.data.name,
        isDefault: values.isDefault,
      };
      const nextChecks = buildLayoutChecks({
        draft: next,
        layouts,
        editingId: null,
        editingIsSystem: false,
        contentKind,
        t,
      });
      if (nextChecks.some((item) => item.level === "err")) {
        setDraft(next);
        setEditing(null);
        toast.warn(t("reportLayout.toast.fixIssues"));
        return;
      }
      createMutation.mutate(toLayoutInput(next), {
        onSuccess: (result) => {
          if (!result.isSuccess || !result.data) return;
          setSaveDraft(null);
          beginDraft(toDraft(result.data), {
            id: result.data.id,
            isSystem: false,
          });
          toast.success(result.message || t("reportLayout.toast.created"));
        },
      });
    },
    [beginDraft, contentKind, createMutation, draft, layouts, t],
  );

  const syncCleanEditor = useCallback(
    (layout: TLayout) => {
      if (editingRef.current?.id !== layout.id || dirtyRef.current) return;
      const next = toDraft(layout);
      setDraft(next);
      setBaseline(cloneDraft(next));
      setEditing({ id: layout.id, isSystem: layout.isSystem });
    },
    [],
  );

  const writeStored = useCallback(
    (
      layout: TLayout,
      bodyPatch: Partial<Pick<TLayoutInput, "isDefault" | "isActive">>,
      successMessage: string,
    ) => {
      const body = { ...toStoredLayoutInput(layout), ...bodyPatch };
      updateMutation.mutate(
        { layoutId: layout.id, body },
        {
          onSuccess: (result) => {
            if (!result.isSuccess || !result.data) return;
            syncCleanEditor(result.data);
            toast.success(result.message || successMessage);
          },
        },
      );
    },
    [syncCleanEditor, updateMutation],
  );

  const shouldBlockNavigation = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      dirtyRef.current && currentLocation.pathname !== nextLocation.pathname,
    [],
  );
  const blocker = useBlocker(shouldBlockNavigation);

  useEffect(() => {
    if (blocker.state !== "blocked") {
      navPromptRef.current = false;
      return;
    }
    if (navPromptRef.current) return;
    navPromptRef.current = true;
    confirmKindRef.current = "nav";
    confirmActionRef.current = () => {
      blocker.proceed();
    };
    setConfirm({
      title: t("reportLayout.confirm.discardTitle"),
      body: t("reportLayout.confirm.discardBody"),
      confirmLabel: t("reportLayout.confirm.discardAction"),
      danger: true,
    });
  }, [blocker, t]);

  const acceptConfirm = useCallback(() => {
    const action = confirmActionRef.current;
    confirmActionRef.current = null;
    confirmKindRef.current = null;
    setConfirm(null);
    action?.();
  }, []);

  const closeConfirm = useCallback(() => {
    const kind = confirmKindRef.current;
    confirmActionRef.current = null;
    confirmKindRef.current = null;
    setConfirm(null);
    if (kind === "nav" && blocker.state === "blocked") blocker.reset();
  }, [blocker]);

  const requestMakeDefault = useCallback(
    (layoutId: string) => {
      const layout = layouts.find((item) => item.id === layoutId);
      if (!layout || layout.isSystem || !permissions.canUpdate) return;
      askConfirm(
        {
          title: t("reportLayout.confirm.defaultTitle", { name: layout.name }),
          body: t("reportLayout.confirm.defaultBody"),
          confirmLabel: t("reportLayout.confirm.defaultAction"),
          danger: false,
        },
        () => {
          writeStored(layout, { isDefault: true }, t("reportLayout.toast.defaultSet"));
        },
      );
    },
    [askConfirm, layouts, permissions.canUpdate, t, writeStored],
  );

  const requestDeactivate = useCallback(
    (layoutId: string) => {
      const layout = layouts.find((item) => item.id === layoutId);
      if (!layout || layout.isSystem || !permissions.canDeactivate) return;
      askConfirm(
        {
          title: t("reportLayout.confirm.deactivateTitle", { name: layout.name }),
          body: t("reportLayout.confirm.deactivateBody"),
          confirmLabel: t("reportLayout.confirm.deactivateAction"),
          danger: true,
        },
        () => {
          deactivateMutation.mutate(layout.id, {
            onSuccess: (result) => {
              if (!result.isSuccess) return;
              if (editingRef.current?.id === layout.id && !dirtyRef.current) {
                const next = toDraft({ ...layout, isActive: false, isDefault: false });
                setDraft(next);
                setBaseline(cloneDraft(next));
              }
              toast.success(result.message || t("reportLayout.toast.deactivated"));
            },
          });
        },
      );
    },
    [askConfirm, deactivateMutation, layouts, permissions.canDeactivate, t],
  );

  const reactivate = useCallback(
    (layoutId: string) => {
      const layout = layouts.find((item) => item.id === layoutId);
      if (!layout || layout.isSystem || !permissions.canUpdate) return;
      if (activeCompanyCount(layouts) >= COMPANY_LAYOUT_LIMIT) {
        toast.warn(t("reportLayout.toast.quota"));
        return;
      }
      writeStored(layout, { isActive: true }, t("reportLayout.toast.reactivated"));
    },
    [layouts, permissions.canUpdate, t, writeStored],
  );

  const applyUsage = useCallback((reportType: string, result: TLastUsedResult) => {
    if (result.status === "found") {
      setUsage((current) => ({
        ...current,
        [reportType]: { status: "found", layout: result.layout },
      }));
      return;
    }
    if (result.status === "empty") {
      setUsage((current) => ({ ...current, [reportType]: { status: "empty" } }));
      return;
    }
    setUsage((current) => ({
      ...current,
      [reportType]: { status: "error", message: result.message },
    }));
  }, []);

  const checkType = useCallback(
    async (reportType: string) => {
      const key = reportType.trim();
      if (!key || !permissions.canLastUsed) return;
      setUsage((current) => ({ ...current, [key]: { status: "loading" } }));
      applyUsage(key, await check(key));
    },
    [applyUsage, check, permissions.canLastUsed],
  );

  const checkAllTypes = useCallback(async () => {
    if (!permissions.canLastUsed) return;
    await Promise.all(REPORT_TYPES.map((reportType) => checkType(reportType)));
  }, [checkType, permissions.canLastUsed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "s") return;
      if (view !== "designer" || !baseline) return;
      event.preventDefault();
      if (editing && !editing.isSystem) updateLayout();
      else openSaveAsNew();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [baseline, editing, openSaveAsNew, updateLayout, view]);

  const reload = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: reportLayoutQueryRootKey });
  }, [queryClient]);

  return {
    view,
    setView,
    includeInactive,
    setIncludeInactive,
    reload,
    isLoading: listQuery.isPending,
    isSummaryLoading: summaryQuery.isPending,
    summary,
    isOpening,
    isSaving: createMutation.isPending || updateMutation.isPending || deactivateMutation.isPending,
    loadError,
    layouts,
    editing,
    hasDraft: baseline !== null,
    draft,
    checks,
    changes,
    blockingCount,
    activeCount: activeCompanyCount(layouts),
    permissions,
    inspectorQuery,
    setInspectorQuery,
    openSections,
    toggleSection,
    expandAll,
    collapseAll,
    canvas,
    setCanvas,
    zoom,
    setZoom,
    guides,
    setGuides,
    sampleTitle,
    setSampleTitle,
    sampleSubtitle,
    setSampleSubtitle,
    contentKind,
    setContentKind,
    autoPdf,
    setAutoPdf,
    pdfUrl,
    pdfError,
    pdfStale,
    pdfLoading,
    renderPdf: () => void runPreview(true),
    openLayout,
    duplicateLayout,
    duplicateDraft,
    startNew,
    patchDraft,
    patchSignature,
    addSignature,
    removeSignature,
    moveSignature,
    revert,
    updateLayout,
    saveDraft,
    openSaveAsNew,
    closeSave: () => setSaveDraft(null),
    submitSave,
    confirm,
    closeConfirm,
    acceptConfirm,
    requestMakeDefault,
    requestDeactivate,
    reactivate,
    usage,
    customType,
    setCustomType,
    checkType,
    checkAllTypes,
  };
};

export type ReportLayoutStudioApi = ReturnType<typeof useReportLayoutStudio>;
