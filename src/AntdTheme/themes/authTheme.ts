import type { ThemeConfig } from "antd";
import { theme } from "antd";
import { DesignTokens } from "../DesignTokens";
import { authCssVariables } from "../cssVariables";

/**
 * Fixed authentication appearance. Auth pages always use this theme
 * and must not participate in light/dark switching.
 * Palette matches public/authLayout.jpg (forest green + white form).
 */
export const authTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: authCssVariables["--Primary400"],
    colorInfo: authCssVariables["--statusB200"],
    colorSuccess: authCssVariables["--statusG200"],
    colorWarning: authCssVariables["--statusY200"],
    colorError: authCssVariables["--statusR200"],
    colorTextBase: authCssVariables["--app-text"],
    colorBgBase: authCssVariables["--app-bg"],
    colorBgContainer: authCssVariables["--app-surface"],
    colorBorder: authCssVariables["--Grey300"],
    colorTextSecondary: authCssVariables["--Grey600"],
    colorTextPlaceholder: authCssVariables["--Grey500"],
    borderRadius: DesignTokens.radius.md,
    fontFamily: DesignTokens.fontFamily.sans,
  },
  components: {
    Button: {
      controlHeight: 44,
      borderRadius: DesignTokens.radius.md,
      primaryColor: authCssVariables["--naturalWhite"],
      defaultBg: "transparent",
      defaultColor: authCssVariables["--app-text"],
      defaultBorderColor: authCssVariables["--Grey400"],
    },
    Input: {
      controlHeight: 44,
      borderRadius: DesignTokens.radius.md,
      colorBgContainer: authCssVariables["--app-surface"],
      activeBorderColor: authCssVariables["--Primary400"],
      hoverBorderColor: authCssVariables["--Grey400"],
    },
    Checkbox: {
      colorPrimary: authCssVariables["--Primary400"],
      colorText: authCssVariables["--Grey600"],
    },
  },
};
