import { Segmented } from "antd";
import type { SegmentedProps } from "antd";
import {
  AppFieldWrapper,
  type AppFieldLabelDirection,
  type AppFieldLabelProps,
} from "../shared/AppFieldWrapper";

export type AppSegmentedLabelDirection = AppFieldLabelDirection;

export type AppSegmentedProps<ValueType = string | number> =
  SegmentedProps<ValueType> & AppFieldLabelProps;

const AppSegmented = <ValueType,>({
  className,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  tooltip,
  ...segmentedProps
}: AppSegmentedProps<ValueType>) => {
  return (
    <AppFieldWrapper
      className={className}
      customLabelDirection={customLabelDirection}
      errorMsg={errorMsg}
      label={label}
      labelPrefix={labelPrefix}
      required={required}
      tooltip={tooltip}
    >
      <Segmented<ValueType>
        className="duration-75! font-semibold!"
        {...segmentedProps}
      />
    </AppFieldWrapper>
  );
};

export { AppSegmented };
export default AppSegmented;
