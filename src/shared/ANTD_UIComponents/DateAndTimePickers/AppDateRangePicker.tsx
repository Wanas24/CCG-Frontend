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

const { RangePicker } = DatePicker;

export type AppDateRangePickerLabelDirection = AppFieldLabelDirection;

export type AppDateRangePickerProps = ComponentProps<typeof RangePicker> &
  AppFieldLabelProps;

const errorBorderClassName =
  "[&_.ant-picker]:border-(--statusR200)! hover:[&_.ant-picker]:border-(--statusR200)! [&_.ant-picker-focused]:border-(--statusR200)!";

export const AppDateRangePicker = ({
  className,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  status,
  tooltip,
  ...rangePickerProps
}: AppDateRangePickerProps) => {
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
      <RangePicker
        prevIcon={pickerHeaderPrevIcon}
        nextIcon={pickerHeaderNextIcon}
        {...rangePickerProps}
        className="w-full"
        status={errorMsg ? "error" : status}
      />
    </AppFieldWrapper>
  );
};

export default AppDateRangePicker;
