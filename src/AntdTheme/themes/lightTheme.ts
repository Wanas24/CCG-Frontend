import type { ThemeConfig } from "antd";
import { theme } from "antd";
import { DesignTokens } from "../DesignTokens";
import { lightCssVariables } from "../cssVariables";

export const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: lightCssVariables["--Primary400"],
    colorInfo: lightCssVariables["--statusB200"],
    colorSuccess: lightCssVariables["--statusG200"],
    colorWarning: lightCssVariables["--statusY200"],
    colorError: lightCssVariables["--statusR200"],
    colorTextBase: lightCssVariables["--naturalBlack"],
    colorBgBase: lightCssVariables["--naturalWhite"],
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
