import type { TLayoutDraft } from "../types";

export const PRESET_KEYS = ["blue", "teal", "dense"] as const;

export type TPresetKey = (typeof PRESET_KEYS)[number];

type TPreset = {
  labelKey: string;
  code: string;
  patch: Partial<TLayoutDraft>;
};

export const LAYOUT_PRESETS: Record<TPresetKey, TPreset> = {
  blue: {
    labelKey: "reportLayout.presets.blue",
    code: "TENANT_BLUE",
    patch: {
      primaryColor: "#1F4E79",
      tableHeaderBackgroundColor: "#1F4E79",
      tableHeaderFontColor: "#FFFFFF",
      headerBackgroundColor: null,
      headerFontColor: null,
      direction: 2,
      showLogo: true,
      headerLeftText: "Al-Harmeen",
      headerCenterText: "{{Title}}",
      headerRightText: "{{Date}}",
      footerCenterText: "Confidential",
    },
  },
  teal: {
    labelKey: "reportLayout.presets.teal",
    code: "TENANT_TEAL",
    patch: {
      primaryColor: "#0F766E",
      secondaryColor: "#14B8A6",
      accentColor: "#ECFDF5",
      tableHeaderBackgroundColor: "#0F766E",
      tableHeaderFontColor: "#FFFFFF",
      headerBackgroundColor: "#0F766E",
      headerFontColor: "#FFFFFF",
      showHeaderBorder: false,
      showLogo: false,
      headerLeftText: "{{Company}}",
      footerLeftText: "Modern ERP",
    },
  },
  dense: {
    labelKey: "reportLayout.presets.dense",
    code: "TENANT_DENSE",
    patch: {
      primaryColor: "#334155",
      tableHeaderBackgroundColor: "#334155",
      orientation: 2,
      baseFontSizePt: 9,
      tableHeaderFontSizePt: 9,
      tableCellPaddingMm: 1,
      marginTopMm: 10,
      marginBottomMm: 10,
      marginLeftMm: 10,
      marginRightMm: 10,
      headerHeightMm: 18,
      footerHeightMm: 14,
      showLogo: false,
    },
  },
};
