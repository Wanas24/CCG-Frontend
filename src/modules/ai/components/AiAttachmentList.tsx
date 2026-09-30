import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { formatAiFileSize } from "../utils/aiComposerLimits";

type AttachmentItem = {
  id: string;
  file: File;
};

type Props = {
  attachments: AttachmentItem[];
  disabled?: boolean;
  onRemove: (id: string) => void;
};

const AiAttachmentList = ({ attachments, disabled, onRemove }: Props) => {
  const { t } = useTranslation();

  if (attachments.length === 0) {
    return null;
  }

  return (
    <ul
      aria-label={t("ai.composer.attachments")}
      className="m-0 flex list-none flex-col gap-1.5 p-0"
    >
      {attachments.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-2 rounded-lg border border-(--Grey300) bg-(--Grey100) px-2 py-1.5 text-xs"
        >
          <div className="min-w-0 flex-1">
            <p dir="ltr" className="m-0 truncate font-medium text-(--app-text)">
              {item.file.name}
            </p>
            <p dir="ltr" className="m-0 text-(--Grey600)">
              {item.file.type || t("ai.composer.unknownType")} ·{" "}
              {formatAiFileSize(item.file.size)}
            </p>
          </div>

          <AppButton
            variant="default"
            disabled={disabled}
            aria-label={t("ai.composer.removeAttachment", {
              name: item.file.name,
            })}
            icon={<X size={16} />}
            onClick={() => onRemove(item.id)}
            className="shrink-0"
          />
        </li>
      ))}
    </ul>
  );
};

export default AiAttachmentList;
