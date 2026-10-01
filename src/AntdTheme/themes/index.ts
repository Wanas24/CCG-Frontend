import { theme } from "antd";
import { darkCssVariables, lightCssVariables } from "../cssVariables";
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
