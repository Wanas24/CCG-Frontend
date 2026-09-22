import { DownOutlined } from "@ant-design/icons";
import {
  Dropdown,
  Input,
  Space,
  type InputProps,
  type MenuProps,
  type DropdownProps,
} from "antd";
import {
  AppFieldWrapper,
  type AppFieldLabelDirection,
  type AppFieldLabelProps,
} from "../shared/AppFieldWrapper";

export type AppInputLabelDirection = AppFieldLabelDirection;

export type AppInputProps = InputProps &
  AppFieldLabelProps & {
    addonDropdownItems?: MenuProps["items"];
    addonDropdownTrigger?: DropdownProps["trigger"];
  };

const errorBorderClassName =
  "[&_.ant-input-outlined]:border-(--statusR200)! [&_.ant-input-affix-wrapper]:border-(--statusR200)! hover:[&_.ant-input-outlined]:border-(--statusR200)! hover:[&_.ant-input-affix-wrapper]:border-(--statusR200)! [&_.ant-input-outlined:focus]:border-(--statusR200)! [&_.ant-input-affix-wrapper-focused]:border-(--statusR200)! [&_.ant-input-group-wrapper]:border-(--statusR200)!";

export const AppInput = ({
  addonBefore,
  addonDropdownItems,
  addonDropdownTrigger = ["hover"],
  className,
  customLabelDirection,
  errorMsg,
  label,
  labelPrefix,
  required,
  status,
  tooltip,
  type,
  ...inputProps
}: AppInputProps) => {
  const resolvedAddonBefore = addonDropdownItems ? (
    <Dropdown
      menu={{ items: addonDropdownItems }}
      trigger={addonDropdownTrigger}
    >
      <DownOutlined className="cursor-pointer!" />
    </Dropdown>
  ) : (
    addonBefore
  );

  const InputComponent = type === "password" ? Input.Password : Input;

  const inputElement = (
    <InputComponent
      {...inputProps}
      type={type === "password" ? undefined : type}
      className="w-full"
      status={errorMsg ? "error" : status}
    />
  );

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
      {resolvedAddonBefore ? (
        <Space.Compact block>
          <span className="inline-flex items-center rounded-s-lg border border-(--Grey300) bg-(--Grey100) px-3 text-(--Grey700)">
            {resolvedAddonBefore}
          </span>
          {inputElement}
        </Space.Compact>
      ) : (
        inputElement
      )}
    </AppFieldWrapper>
  );
};

export default AppInput;
