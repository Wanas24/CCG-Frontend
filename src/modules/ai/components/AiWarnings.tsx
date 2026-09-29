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
    <section
      aria-label={t("ai.response.warnings")}
      className="mt-2 rounded-lg border border-(--statusY200)/40 bg-(--statusY100) px-2 py-2 text-xs text-(--app-text)"
    >
      <div className="mb-1 flex items-center gap-1.5 font-medium text-(--statusY200)">
        <AlertTriangle size={14} aria-hidden="true" className="shrink-0" />
        <span>{t("ai.response.warnings")}</span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {items.map((warning) => (
          <li key={warning} className="whitespace-pre-wrap break-words">
            {warning}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AiWarnings;
