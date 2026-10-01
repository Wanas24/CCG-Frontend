import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

const AiUsageCard = ({ title, description, children, className }: Props) => {
  return (
    <section
      className={clsx(
        "flex flex-col gap-1.5 rounded-xl border border-(--Grey300) bg-(--app-surface) p-3",
        className,
      )}
    >
      <h4 className="m-0 text-sm font-semibold text-(--app-text)">{title}</h4>
      {description ? (
        <p className="m-0 text-xs text-(--Grey600)">{description}</p>
      ) : null}
      {children}
    </section>
  );
};

export default AiUsageCard;
