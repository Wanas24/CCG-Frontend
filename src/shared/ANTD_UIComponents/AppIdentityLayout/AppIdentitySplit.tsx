import type { ReactNode } from "react";
import clsx from "clsx";
import { DesignTokens } from "@/AntdTheme/DesignTokens";

type Props = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
};

const AppIdentitySplit = ({ sidebar, children, className }: Props) => {
  return (
    <div className={clsx(DesignTokens.layout.identitySplit, className)}>
      <div className={DesignTokens.layout.identitySidebar}>{sidebar}</div>
      <div className={DesignTokens.layout.identityMain}>{children}</div>
    </div>
  );
};

export default AppIdentitySplit;
export { AppIdentitySplit };
