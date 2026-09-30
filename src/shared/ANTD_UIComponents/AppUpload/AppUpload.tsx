import type { ComponentProps } from "react";
import { Upload } from "antd";
import clsx from "clsx";
import {
  AppFieldWrapper,
  type AppFieldLabelDirection,
  type AppFieldLabelProps,
} from "../shared/AppFieldWrapper";
import DefaultDraggerContent from "./DefaultDraggerContent";

const { Dragger } = Upload;

export type AppUploadLabelDirection = AppFieldLabelDirection;

export type AppUploadProps = ComponentProps<typeof Dragger> &
  AppFieldLabelProps;

const errorBorderClassName =
  "[&_.ant-upload-drag]:border-(--statusR200)! hover:[&_.ant-upload-drag]:border-(--statusR200)!";

export const AppUpload = ({
  children,
  className,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  tooltip,
  ...uploadProps
}: AppUploadProps) => {
  const hasCustomTrigger = Boolean(children);

  return (
    <AppFieldWrapper
      className={clsx(hasCustomTrigger && "w-full sm:w-fit", className)}
      customLabelDirection={customLabelDirection}
      errorBorderClassName={errorBorderClassName}
      errorMsg={errorMsg}
      label={label}
      labelPrefix={labelPrefix}
      required={required}
      rowLabelAlign="start"
      tooltip={tooltip}
    >
      {hasCustomTrigger ? (
        <Upload {...uploadProps} className="w-full sm:w-fit">
          {children}
        </Upload>
      ) : (
        <Dragger {...uploadProps} className="w-full">
          <DefaultDraggerContent />
        </Dragger>
      )}
    </AppFieldWrapper>
  );
};

export default AppUpload;
