import { theme } from "antd";
import { darkCssVariables, lightCssVariables } from "../cssVariables";
import { createAntdTheme } from "../themeFactory";

export const lightTheme = createAntdTheme(lightCssVariables, {
  algorithm: theme.defaultAlgorithm,
  tokenOverrides: {
    boxShadow: "0 18px 40px -22px rgba(30,40,90,.35)",
    boxShadowSecondary:
      "0 6px 16px rgba(30,40,90,.10), 0 3px 6px rgba(30,40,90,.06)",
    boxShadowTertiary:
      "0 1px 2px rgba(30,40,90,.06), 0 2px 4px rgba(30,40,90,.04)",
  },
  componentOverrides: {
    DatePicker: {
      cellHoverBg: lightCssVariables["--Primary400"],
    },
  },
});

export const darkTheme = createAntdTheme(darkCssVariables, {
  algorithm: theme.darkAlgorithm,
  tokenOverrides: {
    boxShadow: "0 18px 40px -18px rgba(0,0,0,.6)",
    boxShadowSecondary:
      "0 6px 16px rgba(0,0,0,.32), 0 3px 6px rgba(0,0,0,.20)",
    boxShadowTertiary:
      "0 1px 2px rgba(0,0,0,.20), 0 2px 4px rgba(0,0,0,.14)",
  },
  componentOverrides: {
    DatePicker: {
      cellHoverBg: darkCssVariables["--Primary400"],
    },
  },
});
