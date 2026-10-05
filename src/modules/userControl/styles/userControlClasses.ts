import clsx from "clsx";

export const panelClass =
  "flex min-w-0 flex-col rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-[0_18px_40px_-22px_var(--Grey500)]";

export const panelHeadClass = "flex items-center gap-2.5 px-[18px] pt-4 pb-3";

export const panelTitleClass = "m-0 min-w-0 text-[15px] font-bold";

export const panelSearchClass = "px-[18px] pb-3";

export const panelBodyClass =
  "max-h-[calc(100vh-280px)] overflow-auto px-[18px] pb-[18px] max-[1250px]:max-h-none";

export const faintClass = "text-xs text-(--Grey500)";

export const mutedClass = "m-0 text-xs text-(--Grey600)";

export const countClass =
  "ms-auto rounded-full border border-(--Grey400) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)";

export const emptyClass = "px-2.5 py-[30px] text-center text-[13px] text-(--Grey500)";

export const stepLabelClass =
  "mb-1.5 flex min-h-7 items-center gap-2.5 text-xs font-semibold";

export const markClass =
  "grid size-[38px] shrink-0 place-items-center rounded-xl bg-(--Primary400) text-(--app-surface)";

const dragOutlineClass = {
  role: "in-[.ta-dragging-role]:outline-2 in-[.ta-dragging-role]:outline-dashed in-[.ta-dragging-role]:outline-offset-2 in-[.ta-dragging-role]:outline-(--Primary400)",
  user: "in-[.ta-dragging-user]:outline-2 in-[.ta-dragging-user]:outline-dashed in-[.ta-dragging-user]:outline-offset-2 in-[.ta-dragging-user]:outline-(--ta-accent)",
  perm: "in-[.ta-dragging-perm]:outline-2 in-[.ta-dragging-perm]:outline-dashed in-[.ta-dragging-perm]:outline-offset-2 in-[.ta-dragging-perm]:outline-(--ta-accent)",
  group:
    "in-[.ta-dragging-group]:outline-2 in-[.ta-dragging-group]:outline-dashed in-[.ta-dragging-group]:outline-offset-2 in-[.ta-dragging-group]:outline-(--ta-accent)",
} as const;

export const dragOutline = (type: keyof typeof dragOutlineClass) => dragOutlineClass[type];

export const overOutlineClass = "outline-2 outline-(--Primary400)";

export const badgeClass = (tone?: "teal" | "warn" | "danger" | "violet") =>
  clsx(
    "inline-flex items-center gap-1.5 rounded-full border px-2 py-[3px] text-[10px] font-semibold tracking-[0.04em] uppercase",
    tone === "teal" && "border-(--statusB200) bg-(--statusB100) text-(--statusB200)",
    tone === "warn" && "border-(--statusY200) bg-(--statusY100) text-(--statusY200)",
    tone === "danger" && "border-(--statusR200) bg-(--statusR100) text-(--statusR200)",
    tone === "violet" && "border-(--Secondary300) bg-(--Primary100) text-(--Secondary300)",
    !tone && "border-(--Grey400) bg-(--app-surface) text-(--Grey600)",
  );

export const pickClass = (selected: boolean) =>
  clsx(
    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
    selected
      ? "border-transparent bg-(--ta-accent) text-(--app-surface) hover:border-(--app-surface)"
      : "border-(--Grey400) bg-transparent text-(--Grey600) hover:border-(--ta-accent)",
  );

export const pickDotClass = (selected: boolean) =>
  clsx("size-2 rounded-full", selected ? "bg-(--app-surface)" : "bg-(--ta-accent)");

export const avatarClass = (small = false) =>
  clsx(
    "grid shrink-0 place-items-center bg-(--ta-accent) font-bold text-(--app-surface)",
    small
      ? "size-[26px] rounded-full border-2 border-(--app-surface) text-[10px]"
      : "size-9 rounded-xl text-[13px]",
  );

export const iconButtonClass =
  "grid size-[22px] cursor-pointer place-items-center rounded-full border-0 bg-transparent text-inherit";
