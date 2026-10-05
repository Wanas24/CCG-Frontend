import { Popover } from "antd";
import { CircleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  approvalHintI18nKey,
  type ApprovalHintKey,
} from "../hints/approvalHintKeys";

type Props = {
  hintKey: ApprovalHintKey;
};

const ApprovalHintIcon = ({ hintKey }: Props) => {
  const { t } = useTranslation();

  return (
    <Popover
      trigger="click"
      content={
        <p className="m-0 max-w-64 text-sm text-(--app-text)">
          {t(approvalHintI18nKey(hintKey))}
        </p>
      }
    >
      <button
        type="button"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-(--statusY200) hover:bg-(--statusY100)"
        aria-label={t(approvalHintI18nKey(hintKey))}
      >
        <CircleAlert size={14} aria-hidden />
      </button>
    </Popover>
  );
};

export default ApprovalHintIcon;
