import {
  useEffect,
  useState,
  type ClipboardEvent,
  type DragEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import {
  DownOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
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

type PasswordInputProps = Omit<InputProps, "type">;

const preventPasswordExport = (
  event: ClipboardEvent<HTMLInputElement> | DragEvent<HTMLInputElement>,
) => {
  event.preventDefault();
};

const preventPasswordContextMenu = (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();
};

const AppPasswordInput = ({ status, ...inputProps }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const hidePassword = () => setVisible(false);

    window.addEventListener("pointerup", hidePassword);
    window.addEventListener("blur", hidePassword);

    return () => {
      window.removeEventListener("pointerup", hidePassword);
      window.removeEventListener("blur", hidePassword);
    };
  }, [visible]);

  const showPassword = (event: PointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setVisible(true);
  };

  const hidePassword = () => setVisible(false);

  return (
    <Input.Password
      {...inputProps}
      className="w-full"
      status={status}
      onContextMenu={preventPasswordContextMenu}
      onCopy={preventPasswordExport}
      onCut={preventPasswordExport}
      onDragStart={preventPasswordExport}
      visibilityToggle={{
        visible,
        onVisibleChange: () => undefined,
      }}
      iconRender={(isVisible) => (
        <span
          className="inline-flex cursor-pointer touch-none select-none"
          onContextMenu={preventPasswordContextMenu}
          onPointerCancel={hidePassword}
          onPointerDown={showPassword}
          onPointerLeave={hidePassword}
          onPointerUp={hidePassword}
        >
          {isVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </span>
      )}
    />
  );
};

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

  const fieldStatus = errorMsg ? "error" : status;

  const inputElement =
    type === "password" ? (
      <AppPasswordInput {...inputProps} status={fieldStatus} />
    ) : (
      <Input
        {...inputProps}
        type={type}
        className="w-full"
        status={fieldStatus}
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
