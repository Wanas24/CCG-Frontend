import { theme } from "antd";
import {
  authCssVariables,
  darkCssVariables,
  lightCssVariables,
} from "../cssVariables";
import { createAntdTheme } from "../themeFactory";

export const lightTheme = createAntdTheme(lightCssVariables, {
  algorithm: theme.defaultAlgorithm,
  componentOverrides: {
    DatePicker: {
      cellHoverBg: lightCssVariables["--Primary400"],
    },
  },
});

export const darkTheme = createAntdTheme(darkCssVariables, {
  algorithm: theme.darkAlgorithm,
  componentOverrides: {
    DatePicker: {
      cellHoverBg: darkCssVariables["--Primary400"],
    },
  },
});

export const authTheme = createAntdTheme(authCssVariables, {
  algorithm: theme.defaultAlgorithm,
  controlHeight: 44,
  tokenOverrides: {
    colorTextBase: authCssVariables["--app-text"],
    colorBgBase: authCssVariables["--app-bg"],
    colorBgContainer: authCssVariables["--app-surface"],
    colorBorder: authCssVariables["--Grey300"],
    colorTextSecondary: authCssVariables["--Grey600"],
    colorTextPlaceholder: authCssVariables["--Grey500"],
  },
  componentOverrides: {
    Button: {
      primaryColor: authCssVariables["--app-surface"],
      defaultBg: "transparent",
      defaultColor: authCssVariables["--app-text"],
      defaultBorderColor: authCssVariables["--Grey400"],
    },
    Input: {
      colorBgContainer: authCssVariables["--app-surface"],
      activeBorderColor: authCssVariables["--Primary400"],
      hoverBorderColor: authCssVariables["--Grey400"],
    },
    Checkbox: {
      colorPrimary: authCssVariables["--Primary400"],
      colorText: authCssVariables["--Grey600"],
    },
  },
});
