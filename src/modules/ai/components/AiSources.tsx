import { useTranslation } from "react-i18next";
import { Link2 } from "lucide-react";
import type { TAiAssistantSource } from "../types";
import { dedupeAiSources } from "../utils/aiResponseMeta";

type Props = {
  sources?: TAiAssistantSource[];
};

const getSourceLabel = (source: TAiAssistantSource) => {
  const label = source.label?.trim();
  if (label) {
    return label;
  }

  return `${source.type} · ${source.id}`;
};

const AiSources = ({ sources }: Props) => {
  const { t } = useTranslation();
  const items = dedupeAiSources(sources);

  if (items.length === 0) {
    return null;
  }

  return (
    <details className="mt-2 rounded-lg border border-(--Grey300) bg-(--app-surface)/70 text-xs">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 px-2 py-1.5 text-(--Grey700) marker:content-none [&::-webkit-details-marker]:hidden">
        <Link2 size={14} aria-hidden="true" className="shrink-0" />
        <span className="font-medium">{t("ai.response.sources")}</span>
        <span className="text-(--Grey600)">({items.length})</span>
      </summary>

      <ul
        aria-label={t("ai.response.sources")}
        className="m-0 flex list-none flex-col gap-1.5 border-t border-(--Grey300) px-2 py-2"
      >
        {items.map((source) => (
          <li
            key={`${source.type}-${source.id}-${source.label ?? ""}`}
            className="break-words text-(--app-text)"
          >
            {source.label?.trim() ? (
              source.label
            ) : (
              <span dir="ltr" className="font-mono text-[0.7rem]">
                {getSourceLabel(source)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
};

export default AiSources;
