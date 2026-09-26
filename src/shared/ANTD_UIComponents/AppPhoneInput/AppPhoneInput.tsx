import {
  PhoneInput,
  type CountryIso2,
  type PhoneInputProps,
} from "react-international-phone";
import clsx from "clsx";
import { normalizePhoneValue } from "@/shared/validation";
import {
  AppFieldWrapper,
  type AppFieldLabelProps,
} from "../shared/AppFieldWrapper";
import "./AppPhoneInput.css";

export type AppPhoneInputProps = Omit<
  PhoneInputProps,
  "className" | "onChange" | "value"
> &
  AppFieldLabelProps & {
    value?: string;
    onChange?: (phone: string) => void;
    defaultCountry?: CountryIso2;
    className?: string;
  };

const DEFAULT_COUNTRY: CountryIso2 = "eg";
const PREFERRED_COUNTRIES: CountryIso2[] = ["eg"];

export const AppPhoneInput = ({
  className,
  customLabelDirection,
  defaultCountry = DEFAULT_COUNTRY,
  errorMsg,
  label,
  labelPrefix,
  onBlur,
  onChange,
  preferredCountries = PREFERRED_COUNTRIES,
  required,
  tooltip,
  value = "",
  ...phoneInputProps
}: AppPhoneInputProps) => {
  const handleChange = (phone: string) => {
    const nextValue = normalizePhoneValue(phone);
    if (nextValue === value) return;
    onChange?.(nextValue);
  };

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
      <div
        className={clsx("app-phone-input", errorMsg && "app-phone-input--error")}
        dir="ltr"
      >
        <PhoneInput
          {...phoneInputProps}
          defaultCountry={defaultCountry}
          preferredCountries={preferredCountries}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
        />
      </div>
    </AppFieldWrapper>
  );
};

export default AppPhoneInput;
