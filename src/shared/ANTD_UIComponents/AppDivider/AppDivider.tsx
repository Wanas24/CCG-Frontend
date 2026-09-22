import { Divider } from "antd";
import type { ComponentProps } from "react";

type AppDividerProps = ComponentProps<typeof Divider>;

const AppDivider = ({ className, ...props }: AppDividerProps) => {
  return <Divider className={["my-2!", className].filter(Boolean).join(" ")} {...props} />;
};

export default AppDivider;
