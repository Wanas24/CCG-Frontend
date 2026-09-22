import { createContext, useContext } from "react";
import { Checkbox, type CheckboxProps } from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox/Group";
import {
  AppFieldWrapper,
  type AppFieldLabelDirection,
  type AppFieldLabelProps,
} from "../shared/AppFieldWrapper";

const AppCheckBoxGroupContext = createContext(false);

export type AppCheckBoxLabelDirection = AppFieldLabelDirection;

export type AppCheckBoxGroupProps<T = string> = Omit<
  CheckboxGroupProps<T>,
  "className"
> &
  AppFieldLabelProps & {
    /** Styles the field wrapper (label + control column). */
    className?: string;
    /** Styles the underlying `Checkbox.Group`. */
    groupClassName?: string;
  };

export type AppCheckBoxProps = CheckboxProps &
  Partial<AppFieldLabelProps> & {
    className?: string;
  };

export const AppCheckBoxGroup = <T extends string | number = string>({
  className,
  groupClassName,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  tooltip,
  children,
  ...groupProps
}: AppCheckBoxGroupProps<T>) => (
  <AppFieldWrapper
    className={className}
    customLabelDirection={customLabelDirection}
    errorMsg={errorMsg}
    label={label}
    labelPrefix={labelPrefix}
    required={required}
    tooltip={tooltip}
  >
    <AppCheckBoxGroupContext.Provider value={true}>
      <Checkbox.Group {...groupProps} className={groupClassName}>
        {children}
      </Checkbox.Group>
    </AppCheckBoxGroupContext.Provider>
  </AppFieldWrapper>
);

const AppCheckBoxBase = ({
  className,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  tooltip,
  children,
  ...checkboxProps
}: AppCheckBoxProps) => {
  const inGroup = useContext(AppCheckBoxGroupContext);

  if (inGroup) {
    return <Checkbox {...checkboxProps}>{children}</Checkbox>;
  }

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
      <Checkbox {...checkboxProps}>{children}</Checkbox>
    </AppFieldWrapper>
  );
};

type AppCheckBoxComponent = typeof AppCheckBoxBase & {
  Group: typeof AppCheckBoxGroup;
};

export const AppCheckBox = AppCheckBoxBase as AppCheckBoxComponent;
AppCheckBox.Group = AppCheckBoxGroup;

export default AppCheckBox;
