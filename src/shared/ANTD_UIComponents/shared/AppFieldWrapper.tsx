import type { ReactNode } from "react";
import { Tooltip } from "antd";
import clsx from "clsx";
import { Info } from "lucide-react";
import { DesignTokens } from "@/AntdTheme/DesignTokens";

export type AppFieldLabelDirection = "col" | "row";
export type AppFieldRowLabelAlign = "center" | "start";

export type AppFieldLabelProps = {
  label?: string;
  labelPrefix?: ReactNode;
  required?: boolean;
  tooltip?: ReactNode;
  errorMsg?: string;
  customLabelDirection?: AppFieldLabelDirection;
};

export type AppFieldWrapperProps = AppFieldLabelProps & {
  className?: string;
  errorBorderClassName?: string;
  rowLabelAlign?: AppFieldRowLabelAlign;
  children: ReactNode;
};

export const AppFieldWrapper = ({
  children,
  className,
  customLabelDirection = "col",
  errorBorderClassName,
  errorMsg,
  label,
  labelPrefix,
  required,
  rowLabelAlign = "center",
  tooltip,
}: AppFieldWrapperProps) => {
  const isRowLayout = customLabelDirection === "row";
  const showLabel = label || labelPrefix || tooltip || required;

  const labelContent = showLabel && (
    <div className={clsx("flex items-center gap-1", isRowLayout && "shrink-0")}>
      {labelPrefix && (
        <span className="inline-flex text-(--Grey800)">{labelPrefix}</span>
      )}

      {label && (
        <label
          className={clsx(
            "text-(--app-text)",
            DesignTokens.inputs.labelFontSize,
          )}
        >
          {label}
        </label>
      )}

      {required && (
        <span
          className={clsx(
            "leading-none text-(--statusR200)",
            DesignTokens.inputs.requiredAsteriskFontSize,
          )}
        >
          *
        </span>
      )}

      {tooltip && (
        <Tooltip className="bg-(--Primary400)!" title={tooltip}>
          <span className="cursor-help w-4 h-4 text-sm flex items-center justify-center rounded-full text-(--app-surface)! bg-(--Primary400)!">
            <span>i</span>
          </span>
        </Tooltip>
      )}
    </div>
  );

  const errorContent = errorMsg && (
    <div className="my-1 mx-2 flex items-center gap-1 text-xs text-(--statusR200)">
      <Info size={14} />
      <span>{errorMsg}</span>
    </div>
  );

  if (isRowLayout) {
    return (
      <div
        className={clsx(
          "grid w-full gap-x-[10px] gap-y-1",
          showLabel
            ? clsx(
                "grid-cols-[auto_1fr]",
                rowLabelAlign === "start" ? "items-start" : "items-center",
              )
            : "grid-cols-1",
          className,
          errorMsg && errorBorderClassName,
        )}
      >
        {labelContent}
        {children}
        {errorContent && (
          <>
            {showLabel && <div aria-hidden="true" />}
            {errorContent}
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex w-full flex-col gap-1",
        className,
        errorMsg && errorBorderClassName,
      )}
    >
      {labelContent}
      {children}
      {errorContent}
    </div>
  );
};
