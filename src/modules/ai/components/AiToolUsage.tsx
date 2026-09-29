import { useTranslation } from "react-i18next";
import { Wrench } from "lucide-react";
import { dedupeAiLabels } from "../utils/aiResponseMeta";

type Props = {
  usedTools?: string[];
  selectedToolGroups?: string[];
};

const AiToolUsage = ({ usedTools, selectedToolGroups }: Props) => {
  const { t } = useTranslation();
  const tools = dedupeAiLabels(usedTools);
  const groups = dedupeAiLabels(selectedToolGroups);

  if (tools.length === 0 && groups.length === 0) {
    return null;
  }

  return (
    <details className="mt-2 rounded-lg border border-(--Grey300) bg-(--app-surface)/70 text-xs">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 px-2 py-1.5 text-(--Grey700) marker:content-none [&::-webkit-details-marker]:hidden">
        <Wrench size={14} aria-hidden="true" className="shrink-0" />
        <span className="font-medium">
          {tools.length > 0
            ? t("ai.response.toolsUsed")
            : t("ai.response.selectedCapabilities")}
        </span>
        {tools.length > 0 && (
          <span className="text-(--Grey600)">({tools.length})</span>
        )}
      </summary>

      <div className="flex flex-col gap-2 border-t border-(--Grey300) px-2 py-2">
        {groups.length > 0 && (
          <section aria-label={t("ai.response.selectedCapabilities")}>
            <p className="m-0 mb-1 font-medium text-(--Grey700)">
              {t("ai.response.selectedCapabilities")}
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
              {groups.map((group) => (
                <li
                  key={group}
                  dir="ltr"
                  className="rounded-md bg-(--Grey200) px-1.5 py-0.5 font-mono text-[0.7rem] text-(--app-text)"
                >
                  {group}
                </li>
              ))}
            </ul>
          </section>
        )}

        {tools.length > 0 && (
          <section aria-label={t("ai.response.toolsUsed")}>
            {groups.length > 0 && (
              <p className="m-0 mb-1 font-medium text-(--Grey700)">
                {t("ai.response.toolsUsed")}
              </p>
            )}
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {tools.map((tool) => (
                <li
                  key={tool}
                  dir="ltr"
                  className="break-all font-mono text-[0.7rem] text-(--app-text)"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </details>
  );
};

export default AiToolUsage;
