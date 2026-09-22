import type { PropsWithChildren } from "react";
import { Skeleton, type SkeletonProps } from "antd";

export type AppSkeletonProps = PropsWithChildren<SkeletonProps>;

const AppSkeletonBase = (props: AppSkeletonProps) => {
  return <Skeleton {...props} />;
};

type AppSkeletonComponent = typeof AppSkeletonBase & {
  Button: typeof Skeleton.Button;
  Avatar: typeof Skeleton.Avatar;
  Input: typeof Skeleton.Input;
  Image: typeof Skeleton.Image;
  Node: typeof Skeleton.Node;
};

const AppSkeleton = AppSkeletonBase as AppSkeletonComponent;
AppSkeleton.Button = Skeleton.Button;
AppSkeleton.Avatar = Skeleton.Avatar;
AppSkeleton.Input = Skeleton.Input;
AppSkeleton.Image = Skeleton.Image;
AppSkeleton.Node = Skeleton.Node;

export default AppSkeleton;
export { AppSkeleton };
