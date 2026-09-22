import type { ComponentProps } from "react";
import { Input } from "antd";
import {
  AppFieldWrapper,
  type AppFieldLabelDirection,
  type AppFieldLabelProps,
} from "../shared/AppFieldWrapper";

const { TextArea } = Input;

export type AppTextAreaLabelDirection = AppFieldLabelDirection;

export type AppTextAreaProps = ComponentProps<typeof TextArea> &
  AppFieldLabelProps;

const errorBorderClassName =
  "[&_textarea.ant-input]:border-(--statusR200)! hover:[&_textarea.ant-input]:border-(--statusR200)! [&_textarea.ant-input:focus]:border-(--statusR200)!";

export const AppTextArea = ({
  className,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  status,
  tooltip,
  ...textAreaProps
}: AppTextAreaProps) => {
  return (
    <AppFieldWrapper
      className={className}
      customLabelDirection={customLabelDirection}
      errorBorderClassName={errorBorderClassName}
      errorMsg={errorMsg}
      label={label}
      labelPrefix={labelPrefix}
      required={required}
      rowLabelAlign="start"
      tooltip={tooltip}
    >
      <TextArea
        {...textAreaProps}
        className="w-full"
        status={errorMsg ? "error" : status}
      />
    </AppFieldWrapper>
  );
};

export default AppTextArea;
