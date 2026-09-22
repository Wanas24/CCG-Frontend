import type { ComponentProps } from "react";
import { DatePicker } from "antd";
import "./pickerStyles.css";
import {
  pickerHeaderNextIcon,
  pickerHeaderPrevIcon,
} from "./pickerHeaderIcons";
import {
  AppFieldWrapper,
  type AppFieldLabelDirection,
  type AppFieldLabelProps,
} from "../shared/AppFieldWrapper";

export type AppDatePickerLabelDirection = AppFieldLabelDirection;

export type AppDatePickerProps = ComponentProps<typeof DatePicker> &
  AppFieldLabelProps;

const errorBorderClassName =
  "[&_.ant-picker]:border-(--statusR200)! hover:[&_.ant-picker]:border-(--statusR200)! [&_.ant-picker-focused]:border-(--statusR200)!";

export const AppDatePicker = ({
  className,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  status,
  tooltip,
  ...datePickerProps
}: AppDatePickerProps) => {
  return (
    <AppFieldWrapper
      className={className}
      customLabelDirection={customLabelDirection}
      errorBorderClassName={errorBorderClassName}
      errorMsg={errorMsg}
      label={label}
      labelPrefix={labelPrefix}
      required={required}
      tooltip={tooltip}
    >
      <DatePicker
        panelRender={(panel) => <div className="pt-2">{panel}</div>}
        prevIcon={pickerHeaderPrevIcon}
        nextIcon={pickerHeaderNextIcon}
        {...datePickerProps}
        className="w-full"
        status={errorMsg ? "error" : status}
      />
    </AppFieldWrapper>
  );
};

export default AppDatePicker;
