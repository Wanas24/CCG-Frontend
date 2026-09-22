import { Button, type ButtonProps } from "antd";
import clsx from "clsx";
import { Trash2 } from "lucide-react";

export type AppButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "default"
  | "delete";

export type AppButtonIconPlacement = "start" | "end";

export interface AppButtonProps extends Omit<ButtonProps, "variant" | "color"> {
  variant?: AppButtonVariant;
  iconPlacement?: AppButtonIconPlacement;
}

const variantConfig: Record<
  AppButtonVariant,
  Pick<ButtonProps, "color" | "variant"> & { className?: string }
> = {
  primary: { color: "primary", variant: "solid", className: "cursor-pointer!" },
  secondary: {
    color: "default",
    variant: "outlined",
    className:
      "cursor-pointer! bg-(--naturalWhite)! border-2! border-(--Grey300)!",
  },
  tertiary: {
    color: "default",
    variant: "link",
    className: "underline underline-offset-4 cursor-pointer!",
  },
  default: {
    color: "default",
    variant: "text",
    className: "cursor-pointer! hover:bg-transparent! px-2!",
  },
  delete: {
    color: "default",
    variant: "text",
    className:
      "cursor-pointer! hover:bg-(--statusR100)! text-(--statusR200)! px-2!",
  },
};

export const AppButton = ({
  variant = "primary",
  iconPlacement = "start",
  className,
  children,
  icon,
  ...props
}: AppButtonProps) => {
  const config = variantConfig[variant];
  const deleteIcon = <Trash2 size={20} />;
  const resolvedIcon = variant === "delete" ? (icon ?? deleteIcon) : icon;

  return (
    <Button
      {...props}
      icon={resolvedIcon}
      color={config.color}
      variant={config.variant}
      iconPlacement={iconPlacement}
      className={clsx(config.className, className)}
    >
      {children}
    </Button>
  );
};

export default AppButton;
