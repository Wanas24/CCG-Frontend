import type { ThemeConfig } from "antd";
import { theme } from "antd";
import { DesignTokens } from "../DesignTokens";
import { darkCssVariables } from "../cssVariables";

export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: darkCssVariables["--Primary400"],
    colorInfo: darkCssVariables["--statusB200"],
    colorSuccess: darkCssVariables["--statusG200"],
    colorWarning: darkCssVariables["--statusY200"],
    colorError: darkCssVariables["--statusR200"],
    colorTextBase: darkCssVariables["--naturalBlack"],
    colorBgBase: darkCssVariables["--naturalWhite"],
    borderRadius: DesignTokens.radius.md,
    fontFamily: DesignTokens.fontFamily.sans,
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: DesignTokens.radius.md,
    },
    Input: {
      controlHeight: 40,
      borderRadius: DesignTokens.radius.md,
    },
  },
};
