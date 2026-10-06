import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { ApprovalApproverType } from "../types";
import type { ApprovalStudioApi } from "../hooks/useApprovalStudio";
import { buildApprovalPlainWords } from "../utils/buildApprovalPlainWords";

type Props = {
  studio: ApprovalStudioApi;
};

const ApprovalPlainWords = ({ studio }: Props) => {
  const { t } = useTranslation();
  const draft = studio.builder;

  if (!draft) return null;

  const entityLabel = draft.entityType
    ? studio.entityName(draft.entityType)
    : null;

  const content = buildApprovalPlainWords(draft, {
    entityLabel,
    t,
    resolveApproverLabel: (approverType, approverKey) => {
      if (approverType === ApprovalApproverType.Role) {
        return (
          studio.roles?.find((role) => role.id === approverKey)?.name ?? null
        );
      }

      const employee = studio.employees?.find(
        (item) => item.id === approverKey,
      );
      if (!employee) return null;
      const name = `${employee.firstName} ${employee.lastName}`.trim();
      return name || employee.email || null;
    },
  });

  return (
    <section
      className="rounded-2xl border border-(--Grey300) bg-(--Grey100) px-4 py-3"
      aria-label={t("approval.builder.plainWords")}
    >
      <h3
        className={`${DesignTokens.inputs.labelFontSize} ${DesignTokens.typography.emphasis} m-0`}
      >
        {t("approval.builder.plainWords")}
      </h3>

      {content.empty ? (
        <p className="m-0 mt-2 text-sm text-(--Grey600)">
          {content.emptyMessage}
        </p>
      ) : (
        <div className="mt-2 flex flex-col gap-2 text-sm text-(--app-text)">
          <p className="m-0 text-(--Grey600)">{content.intro}</p>
          <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
            {content.levels.map((level) => (
              <li key={level.key} className="m-0">
                <span className={DesignTokens.typography.emphasis}>
                  {level.heading}
                </span>{" "}
                <span className="text-(--Grey600)">{level.detail}</span>
              </li>
            ))}
          </ol>
          <p className="m-0 text-(--Grey600)">{content.decline}</p>
        </div>
      )}
    </section>
  );
};

export default ApprovalPlainWords;
