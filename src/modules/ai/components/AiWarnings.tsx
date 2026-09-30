import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import { dedupeAiLabels } from "../utils/aiResponseMeta";

type Props = {
  warnings?: string[];
};

const AiWarnings = ({ warnings }: Props) => {
  const { t } = useTranslation();
  const items = dedupeAiLabels(warnings);

  if (items.length === 0) {
    return null;
  }

  return (
    <details className="mt-1.5 text-xs text-(--statusY200)" open={items.length === 1}>
      <summary className="flex cursor-pointer list-none items-center gap-1.5 py-0.5 marker:content-none [&::-webkit-details-marker]:hidden">
        <AlertTriangle
          size={12}
          aria-hidden="true"
          className="shrink-0"
        />
        <span className="min-w-0 truncate font-medium">
          {t("ai.response.warnings")}
        </span>
        <span className="shrink-0 opacity-80">· {items.length}</span>
      </summary>

      <ul
        aria-label={t("ai.response.warnings")}
        className="ms-4 mt-1 flex list-none flex-col gap-1 border-s border-(--statusY200)/40 ps-2 text-(--app-text)"
      >
        {items.map((warning) => (
          <li key={warning} className="whitespace-pre-wrap break-words">
            {warning}
          </li>
        ))}
      </ul>
    </details>
  );
};

export default AiWarnings;
