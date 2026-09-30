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
  const total = tools.length + groups.length;

  if (total === 0) {
    return null;
  }

  return (
    <details className="mt-1.5 text-xs text-(--Grey700)">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 py-0.5 marker:content-none [&::-webkit-details-marker]:hidden">
        <Wrench size={12} aria-hidden="true" className="shrink-0 opacity-70" />
        <span className="min-w-0 truncate font-medium">
          {tools.length > 0
            ? t("ai.response.toolsUsed")
            : t("ai.response.selectedCapabilities")}
        </span>
        <span className="shrink-0 text-(--Grey600)">· {total}</span>
      </summary>

      <div className="ms-4 mt-1 flex flex-col gap-1.5 border-s border-(--Grey300) ps-2">
        {groups.length > 0 && (
          <section aria-label={t("ai.response.selectedCapabilities")}>
            <p className="m-0 mb-0.5 text-[0.7rem] font-medium text-(--Grey600)">
              {t("ai.response.selectedCapabilities")}
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
              {groups.map((group) => (
                <li
                  key={group}
                  dir="ltr"
                  className="max-w-full truncate rounded bg-(--Grey200) px-1.5 py-0.5 font-mono text-[0.7rem] text-(--app-text)"
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
              <p className="m-0 mb-0.5 text-[0.7rem] font-medium text-(--Grey600)">
                {t("ai.response.toolsUsed")}
              </p>
            )}
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
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
