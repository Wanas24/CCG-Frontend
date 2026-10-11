import type { ReactNode } from "react";
import clsx from "clsx";
import { DesignTokens } from "@/AntdTheme/DesignTokens";

export type AppEmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

const AppEmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: AppEmptyStateProps) => {
  return (
    <div
      className={clsx(
        "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-(--Grey300) bg-(--Grey100)/70 px-4 py-10 text-center sm:px-8 sm:py-12",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl border border-(--Grey300) bg-(--app-surface) text-(--Grey500)">
        {icon}
      </div>
      <div className="flex max-w-md flex-col gap-1">
        <h3 className={`m-0 ${DesignTokens.typography.headingSm}`}>{title}</h3>
        {description ? (
          <p className={`m-0 text-sm leading-relaxed ${DesignTokens.typography.muted}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{action}</div> : null}
    </div>
  );
};

export default AppEmptyState;
export { AppEmptyState };
