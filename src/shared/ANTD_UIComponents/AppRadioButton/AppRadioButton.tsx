import { createContext, useContext } from "react";
import { Radio, type RadioGroupProps, type RadioProps } from "antd";
import clsx from "clsx";
import {
  AppFieldWrapper,
  type AppFieldLabelDirection,
  type AppFieldLabelProps,
} from "../shared/AppFieldWrapper";

const APP_RADIO_BUTTON_CLASS = "app-radio-button";

const AppRadioGroupContext = createContext(false);

const withAppRadioButtonClass = (
  options: RadioGroupProps["options"],
): RadioGroupProps["options"] =>
  options?.map((option) => {
    if (typeof option === "string" || typeof option === "number") {
      return {
        label: String(option),
        value: option,
        className: APP_RADIO_BUTTON_CLASS,
      };
    }

    return {
      ...option,
      className: clsx(APP_RADIO_BUTTON_CLASS, option.className),
    };
  });

export type AppRadioButtonLabelDirection = AppFieldLabelDirection;

export type AppRadioButtonGroupProps = Omit<RadioGroupProps, "className"> &
  AppFieldLabelProps & {
    /** Styles the field wrapper (label + control column). */
    className?: string;
    /** Styles the underlying `Radio.Group` (use for option gap, e.g. `gap-5`). */
    groupClassName?: string;
  };

export type AppRadioButtonProps = RadioProps &
  Partial<AppFieldLabelProps> & {
    className?: string;
  };

const AppRadioButtonGroup = ({
  className,
  groupClassName,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  tooltip,
  children,
  options,
  ...groupProps
}: AppRadioButtonGroupProps) => {
  const control = options ? (
    <Radio.Group
      {...groupProps}
      className={groupClassName}
      options={withAppRadioButtonClass(options)}
    />
  ) : (
    <Radio.Group {...groupProps} className={groupClassName}>
      {children}
    </Radio.Group>
  );

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
      <AppRadioGroupContext.Provider value={true}>
        {control}
      </AppRadioGroupContext.Provider>
    </AppFieldWrapper>
  );
};

const AppRadioButtonBase = ({
  className,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  tooltip,
  children,
  ...radioProps
}: AppRadioButtonProps) => {
  const inGroup = useContext(AppRadioGroupContext);

  if (inGroup) {
    return (
      <Radio {...radioProps} className={APP_RADIO_BUTTON_CLASS}>
        {children}
      </Radio>
    );
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
      <Radio {...radioProps} className={APP_RADIO_BUTTON_CLASS}>
        {children}
      </Radio>
    </AppFieldWrapper>
  );
};

type AppRadioButtonComponent = typeof AppRadioButtonBase & {
  Group: typeof AppRadioButtonGroup;
};

const AppRadioButton = AppRadioButtonBase as AppRadioButtonComponent;
AppRadioButton.Group = AppRadioButtonGroup;

export default AppRadioButton;
export { AppRadioButton, AppRadioButtonGroup };
