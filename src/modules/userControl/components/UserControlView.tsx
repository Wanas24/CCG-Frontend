import { startTransition, useState, ViewTransition } from "react";
import clsx from "clsx";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { LayoutGrid, Network, RefreshCw, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import type { UserControlModel } from "../hooks/useUserControl";
import { permissionLabel, personName } from "../utils/userControlDisplay";
import {
  emptyClass,
  faintClass,
  overOutlineClass,
} from "../styles/userControlClasses";
import UserControlBoard from "./UserControlBoard";
import CoverageMatrix from "./CoverageMatrix";
import AccessMap from "./AccessMap";
import RolePermissionDrawer from "./RolePermissionDrawer";
import UserControlDialogs from "./UserControlDialogs";
import {
  isUserControlDragPayload,
  isUserControlDropTarget,
  type UserControlDragPayload,
  type UserControlDropTarget,
} from "./userControlDrag";
import "../styles/userControl.css";

type View = "board" | "matrix" | "map";

type Props = {
  userControl: UserControlModel;
};

const absorbedDropAnimation: DropAnimation = {
  duration:
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 200,
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  sideEffects: null,
  keyframes({ transform }) {
    const resting = CSS.Transform.toString(transform.initial) ?? "none";
    const absorbed =
      CSS.Transform.toString({
        x: transform.initial.x,
        y: transform.initial.y + 8,
        scaleX: transform.initial.scaleX * 0.82,
        scaleY: transform.initial.scaleY * 0.82,
      }) ?? resting;
    return [
      { opacity: 1, transform: resting },
      { opacity: 0, transform: absorbed },
    ];
  },
};

const permissionLandsOnRole = (
  payload: UserControlDragPayload,
  target: UserControlDropTarget,
  userControl: UserControlModel,
) => {
  if (
    target.target !== "role" ||
    target.isShared ||
    !userControl.canSetPermissions ||
    !userControl.permissionsReady.has(target.roleId)
  ) {
    return false;
  }
  const current = userControl.rolePerms.get(target.roleId) ?? new Set<number>();
  if (payload.type === "perm") return !current.has(payload.id);
  if (payload.type !== "group") return false;
  const group = userControl.groups.find((item) => item.name === payload.id);
  return group?.actions.some((action) => !current.has(action.id)) ?? false;
};


const viewTabClass = (active: boolean) =>
  clsx(
    "inline-flex cursor-pointer items-center gap-2 rounded-[9px] border-0 px-3.5 py-2 text-[13px] font-semibold",
    active ? "bg-(--Primary400) text-(--app-surface)" : "bg-transparent text-(--Grey600)",
  );

const collisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args);
  return pointerHits.length > 0 ? pointerHits : rectIntersection(args);
};

const dragLabel = (
  drag: UserControlDragPayload,
  userControl: UserControlModel,
) => {
  if (drag.type === "role" || drag.type === "rolechip") {
    const roleId = drag.type === "role" ? drag.id : drag.roleId;
    return userControl.roles.find((role) => role.id === roleId)?.name ?? roleId;
  }
  if (drag.type === "user") {
    const employee = userControl.employees.find((item) => item.id === drag.id);
    return employee ? personName(employee) : drag.id;
  }
  if (drag.type === "perm") {
    for (const group of userControl.groups) {
      const action = group.actions.find((item) => item.id === drag.id);
      if (action) return permissionLabel(action);
    }
    return String(drag.id);
  }
  return drag.id;
};

const UnassignZone = ({ active }: { active: boolean }) => {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({
    id: "drop-unassign",
    data: { target: "unassign" } satisfies UserControlDropTarget,
    disabled: !active,
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "fixed start-1/2 bottom-6 z-[60] flex -translate-x-1/2 translate-y-[140%] items-center gap-2.5 rounded-2xl border-2 border-dashed border-(--app-surface) bg-(--statusR200) px-7 py-4 font-bold text-(--app-surface) rtl:translate-x-1/2 in-[.ta-dragging-rolechip]:translate-y-0",
        isOver && overOutlineClass,
      )}
    >
      {t("userControl.unassignZone")}
    </div>
  );
};

const UserControlView = ({ userControl }: Props) => {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("board");
  const [drag, setDrag] = useState<UserControlDragPayload | null>(null);
  const [absorbDrop, setAbsorbDrop] = useState(false);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const onDragStart = (event: DragStartEvent) => {
    setAbsorbDrop(false);
    if (isUserControlDragPayload(event.active.data.current))
      setDrag(event.active.data.current);
  };

  const finishDrag = (event: DragEndEvent) => {
    const payload = event.active.data.current;
    const target = event.over?.data.current;
    const landed =
      isUserControlDragPayload(payload) &&
      isUserControlDropTarget(target) &&
      permissionLandsOnRole(payload, target, userControl);
    setAbsorbDrop(landed);
    setDrag(null);
    if (!isUserControlDragPayload(payload) || !isUserControlDropTarget(target))
      return;

    if (payload.type === "role" && target.target === "employee") {
      void userControl.assignRole(target.userId, payload.id);
      return;
    }
    if (payload.type === "user" && target.target === "role") {
      void userControl.assignRole(payload.id, target.roleId);
      return;
    }
    if (
      payload.type === "perm" &&
      target.target === "role" &&
      !target.isShared &&
      userControl.canSetPermissions
    ) {
      void userControl.grantPermissions(target.roleId, [payload.id]);
      return;
    }
    if (
      payload.type === "group" &&
      target.target === "role" &&
      !target.isShared &&
      userControl.canSetPermissions
    ) {
      const group = userControl.groups.find((item) => item.name === payload.id);
      void userControl.grantPermissions(
        target.roleId,
        group?.actions.map((action) => action.id) ?? [],
      );
      return;
    }
    if (
      payload.type === "rolechip" &&
      target.target === "unassign" &&
      userControl.canUnassign
    ) {
      void userControl.unassignRole(payload.userId, payload.roleId);
    }
  };

  const denied = userControl.denied
    .map((resource) => t(`userControl.denied.${resource}`))
    .join(t("userControl.listSeparator"));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragEnd={finishDrag}
      onDragCancel={() => {
        setAbsorbDrop(false);
        setDrag(null);
      }}
    >
      <div className={clsx("flex flex-col gap-[18px]", drag && `ta-dragging-${drag.type}`)}>
        {userControl.isBusy ? (
          <div className="sticky top-0 z-[5] h-[3px] overflow-hidden bg-(--Grey200)" aria-hidden>
            <span className="ta-busy-bar block h-full w-[35%] bg-(--Primary400)" />
          </div>
        ) : null}

        {userControl.denied.length > 0 ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-(--statusB200) bg-(--statusB100) px-3.5 py-3 text-[13px] text-(--statusB200)">
            {t("userControl.limitedView", { items: denied })}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex gap-1 rounded-xl border border-(--Grey300) bg-(--app-surface) p-1">
            <button
              type="button"
              className={viewTabClass(view === "board")}
              onClick={() => startTransition(() => setView("board"))}
            >
              <LayoutGrid size={16} aria-hidden />
              {t("userControl.views.board")}
            </button>
            <button
              type="button"
              className={viewTabClass(view === "matrix")}
              onClick={() => startTransition(() => setView("matrix"))}
            >
              <Table2 size={16} aria-hidden />
              {t("userControl.views.matrix")}
            </button>
            <button
              type="button"
              className={viewTabClass(view === "map")}
              onClick={() => startTransition(() => setView("map"))}
            >
              <Network size={16} aria-hidden />
              {t("userControl.views.map")}
            </button>
          </div>
          <span className={faintClass}>{t("userControl.views.dragTip")}</span>
          <AppButton
            variant="secondary"
            className="ms-auto"
            icon={<RefreshCw size={16} aria-hidden />}
            aria-label={t("userControl.reload")}
            onClick={() => void userControl.reload()}
          >
            {t("userControl.reload")}
          </AppButton>
        </div>

        <ViewTransition>
          {userControl.allFailed ? (
            <p className={emptyClass}>{t("userControl.loadFailed")}</p>
          ) : view === "board" ? (
            <UserControlBoard userControl={userControl} drag={drag} />
          ) : view === "matrix" ? (
            <CoverageMatrix userControl={userControl} />
          ) : (
            <AccessMap userControl={userControl} />
          )}
        </ViewTransition>

        <UnassignZone
          active={drag?.type === "rolechip" && userControl.canUnassign}
        />

        <DragOverlay dropAnimation={absorbDrop ? absorbedDropAnimation : undefined}>
          {drag ? (
            <div className="rounded-full bg-(--Primary400) px-3.5 py-2 text-[13px] font-bold text-(--app-surface)">
              {dragLabel(drag, userControl)}
            </div>
          ) : null}
        </DragOverlay>

        <RolePermissionDrawer userControl={userControl} />
        <UserControlDialogs userControl={userControl} />
      </div>
    </DndContext>
  );
};

export default UserControlView;
