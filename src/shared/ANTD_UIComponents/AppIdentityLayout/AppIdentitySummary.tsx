import type { ReactNode } from "react";
import { DesignTokens } from "@/AntdTheme/DesignTokens";

type Props = {
  title: string;
  subtitle?: string;
  status?: ReactNode;
};

const AppIdentitySummary = ({ title, subtitle, status }: Props) => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className={DesignTokens.typography.headingSm}>{title}</p>
      {subtitle ? (
        <p
          className={`${DesignTokens.inputs.labelFontSize} ${DesignTokens.typography.muted}`}
        >
          {subtitle}
        </p>
      ) : null}
      {status}
    </div>
  );
};

export default AppIdentitySummary;
export { AppIdentitySummary };
