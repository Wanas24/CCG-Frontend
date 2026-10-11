import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  myApprovalActionLabelKey,
  myApprovalStatusLabelKey,
} from "../../utils/myApprovalRequestMaps";

type Props = {
  actionType: number;
  status: number;
};

const badgeClass = (kind: "action" | "status", value: number) => {
  if (kind === "action") {
    if (value === 0) {
      return "border-(--statusG200) text-(--statusG200)";
    }
    if (value === 1) {
      return "border-(--Primary400) text-(--Primary400)";
    }
    return "border-(--statusR200) text-(--statusR200)";
  }

  if (value === 0) {
    return "border-(--statusY200) text-(--statusY200) bg-(--statusY100)";
  }
  if (value === 1) {
    return "border-(--statusG200) text-(--statusG200) bg-(--statusG100)";
  }
  if (value === 2) {
    return "border-(--statusR200) text-(--statusR200) bg-(--statusR100)";
  }
  return "border-(--Grey400) text-(--Grey600) bg-(--Grey100)";
};

const MyApprovalRequestBadges = ({ actionType, status }: Props) => {
  const { t } = useTranslation();
  const actionKey = myApprovalActionLabelKey(actionType);
  const statusKey = myApprovalStatusLabelKey(status);

  return (
    <>
      <span
        className={clsx(
          "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
          badgeClass("action", actionType),
        )}
      >
        {actionKey ? t(actionKey) : String(actionType)}
      </span>
      <span
        className={clsx(
          "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
          badgeClass("status", status),
        )}
      >
        {statusKey ? t(statusKey) : String(status)}
      </span>
    </>
  );
};

export default MyApprovalRequestBadges;
