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

export type AppButtonPadding = "default" | "none";

export interface AppButtonProps extends Omit<ButtonProps, "variant" | "color"> {
  variant?: AppButtonVariant;
  iconPlacement?: AppButtonIconPlacement;
  padding?: AppButtonPadding;
}

const variantConfig: Record<
  AppButtonVariant,
  Pick<ButtonProps, "color" | "variant"> & { className?: string }
> = {
  primary: {
    color: "primary",
    variant: "solid",
    className: "cursor-pointer! h-11 w-full sm:w-fit",
  },
  secondary: {
    color: "default",
    variant: "outlined",
    className:
      "cursor-pointer! bg-(--app-surface)! border-2! border-(--Grey300)!",
  },
  tertiary: {
    color: "default",
    variant: "link",
    className: "underline underline-offset-4 cursor-pointer!",
  },
  default: {
    color: "default",
    variant: "text",
    className: "cursor-pointer! hover:bg-transparent!",
  },
  delete: {
    color: "default",
    variant: "text",
    className:
      "cursor-pointer! w-fit shrink-0 hover:bg-(--statusR100)! text-(--statusR200)!",
  },
};

const variantPaddingClass: Partial<Record<AppButtonVariant, string>> = {
  default: "px-2!",
  delete: "px-2!",
};

export const AppButton = ({
  variant = "primary",
  iconPlacement = "start",
  padding = "default",
  className,
  children,
  icon,
  block,
  ...props
}: AppButtonProps) => {
  const config = variantConfig[variant];
  const deleteIcon = <Trash2 size={20} />;
  const resolvedIcon = variant === "delete" ? (icon ?? deleteIcon) : icon;
  const paddingClass =
    padding === "none" ? undefined : variantPaddingClass[variant];

  return (
    <Button
      {...props}
      block={block}
      icon={resolvedIcon}
      color={config.color}
      variant={config.variant}
      iconPlacement={iconPlacement}
      className={clsx(
        config.className,
        paddingClass,
        block && "w-full!",
        className,
      )}
    >
      {children}
    </Button>
  );
};

export default AppButton;
