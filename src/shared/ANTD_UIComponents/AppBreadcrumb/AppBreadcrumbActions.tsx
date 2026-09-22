import { Bookmark, BookmarkPlus } from "lucide-react";

const actionButtonClassName =
  "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-(--Grey900) transition-colors hover:bg-(--Grey200) hover:text-(--naturalBlack)";

const AppBreadcrumbActions = () => {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button type="button" className={actionButtonClassName} aria-label="Saved pages">
        <Bookmark size={20} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className={actionButtonClassName}
        aria-label="Add page to favorites"
      >
        <BookmarkPlus size={20} strokeWidth={1.75} />
      </button>
    </div>
  );
};

export default AppBreadcrumbActions;
