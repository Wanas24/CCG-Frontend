const fallbackTimeZones = ["Africa/Cairo", "UTC"];

export const getTimeZoneOptions = (): string[] => {
  if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
    return Intl.supportedValuesOf("timeZone");
  }

  return fallbackTimeZones;
};

export const getDefaultTimeZoneId = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Cairo";
};
