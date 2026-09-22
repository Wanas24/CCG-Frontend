import { Select, type SelectProps } from "antd";
import { useLocale } from "@/i18n/useLocale";
import {
  AppFieldWrapper,
  type AppFieldLabelProps,
} from "../shared/AppFieldWrapper";

export type AppDropDownSelectProps = SelectProps & AppFieldLabelProps;

const errorBorderClassName =
  "[&_.ant-select-selector]:border-(--statusR200)! hover:[&_.ant-select-selector]:border-(--statusR200)! [&_.ant-select-focused_.ant-select-selector]:border-(--statusR200)! [&_.ant-select-open_.ant-select-selector]:border-(--statusR200)!";

export const AppDropDownSelect = ({
  className,
  customLabelDirection,
  direction: directionProp,
  errorMsg,
  label,
  labelPrefix,
  required,
  status,
  tooltip,
  ...selectProps
}: AppDropDownSelectProps) => {
  const { direction: localeDirection } = useLocale();
  const direction = directionProp ?? localeDirection;

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
      <Select
        {...selectProps}
        className="w-full"
        direction={direction}
        status={errorMsg ? "error" : status}
      />
    </AppFieldWrapper>
  );
};
export default AppDropDownSelect;
