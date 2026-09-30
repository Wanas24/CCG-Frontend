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
    <details className="mt-1.5 text-xs text-(--Grey700)">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 py-0.5 marker:content-none [&::-webkit-details-marker]:hidden">
        <Link2 size={12} aria-hidden="true" className="shrink-0 opacity-70" />
        <span className="min-w-0 truncate font-medium">
          {t("ai.response.sources")}
        </span>
        <span className="shrink-0 text-(--Grey600)">· {items.length}</span>
      </summary>

      <ul
        aria-label={t("ai.response.sources")}
        className="ms-4 mt-1 flex list-none flex-col gap-1 border-s border-(--Grey300) ps-2"
      >
        {items.map((source) => (
          <li
            key={`${source.type}-${source.id}-${source.label ?? ""}`}
            className="min-w-0 break-words text-(--app-text)"
          >
            {source.label?.trim() ? (
              <span className="break-words">{source.label}</span>
            ) : (
              <span dir="ltr" className="break-all font-mono text-[0.7rem]">
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
