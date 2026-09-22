import { Tag, type TagProps } from "antd";
import clsx from "clsx";
import "./styles.css";

export type AppTagVariant =
  | "dataCount"
  | "active"
  | "inReview"
  | "pending"
  | "rejected"
  | "draft"
  | "primary";

export interface AppTagProps extends Omit<TagProps, "variant"> {
  variant?: AppTagVariant;
}

const variantClassNames: Record<AppTagVariant, string> = {
  dataCount:
    "rounded-lg! bg-(--statusG100)! px-2.5! py-0.5! text-sm! font-medium! text-(--statusG300)! border-0!",
  active: "border-0! bg-(--statusG100)! text-(--statusG200)!",
  inReview: "border-0! bg-(--statusB100)! text-(--statusB200)!",
  pending: "border-0! bg-(--statusY100)! text-(--statusY200)!",
  rejected: "border-0! bg-(--statusR100)! text-(--statusR200)!",
  draft: "border-0! bg-(--Grey200)! text-(--Grey800)!",
  primary:
    "border! border-(--Primary300)! bg-(--Primary100)! text-(--Primary400)!",
};

const AppTagBase = ({
  variant,
  className,
  bordered,
  ...props
}: AppTagProps) => (
  <Tag
    {...props}
    bordered={variant === "primary" ? true : bordered}
    className={clsx(variant && variantClassNames[variant], className)}
  />
);

type AppTagComponent = typeof AppTagBase & {
  CheckableTag: typeof Tag.CheckableTag;
};

export const AppTag = AppTagBase as AppTagComponent;
AppTag.CheckableTag = Tag.CheckableTag;

export default AppTag;
