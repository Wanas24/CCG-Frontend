import type { ThemeConfig } from "antd";
import { theme } from "antd";
import { DesignTokens } from "../DesignTokens";
import { authCssVariables } from "../cssVariables";

/**
 * Fixed authentication appearance. Auth pages always use this theme
 * and must not participate in light/dark switching.
 */
export const authTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#FFFFFF",
    colorInfo: authCssVariables["--statusB200"],
    colorSuccess: authCssVariables["--statusG200"],
    colorWarning: authCssVariables["--statusY200"],
    colorError: authCssVariables["--statusR200"],
    colorTextBase: authCssVariables["--app-text"],
    colorBgBase: authCssVariables["--app-bg"],
    colorBgContainer: authCssVariables["--app-surface"],
    colorBorder: authCssVariables["--Grey300"],
    borderRadius: DesignTokens.radius.md,
    fontFamily: DesignTokens.fontFamily.sans,
  },
  components: {
    Button: {
      controlHeight: 44,
      borderRadius: DesignTokens.radius.md,
      primaryColor: "#0B0B0B",
      defaultBg: "transparent",
      defaultColor: authCssVariables["--app-text"],
      defaultBorderColor: authCssVariables["--Grey400"],
    },
    Input: {
      controlHeight: 44,
      borderRadius: DesignTokens.radius.md,
      colorBgContainer: "#0F0F0F",
      activeBorderColor: "#FFFFFF",
      hoverBorderColor: authCssVariables["--Grey500"],
    },
    Checkbox: {
      colorPrimary: "#FFFFFF",
      colorText: authCssVariables["--app-text"],
    },
  },
};
