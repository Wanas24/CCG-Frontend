import type { PropsWithChildren } from "react";
import { Drawer, type DrawerProps } from "antd";

export type AppDrawerProps = PropsWithChildren<DrawerProps>;

export const AppDrawer = (props: AppDrawerProps) => {
  return <Drawer {...props} />;
};

export default AppDrawer;
