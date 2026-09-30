import { DesignTokens } from "@/AntdTheme/DesignTokens";

export type AppInfoRow = {
  label: string;
  value: string;
};

type Props = {
  rows: AppInfoRow[];
};

const AppInfoRows = ({ rows }: Props) => {
  return (
    <div className="flex flex-col divide-y divide-(--Grey300)">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
        >
          <span
            className={`${DesignTokens.inputs.labelFontSize} ${DesignTokens.typography.muted} shrink-0`}
          >
            {row.label}
          </span>
          <span
            className={`${DesignTokens.inputs.labelFontSize} min-w-0 text-end break-all text-(--app-text)`}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AppInfoRows;
export { AppInfoRows };
