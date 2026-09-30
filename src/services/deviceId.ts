const DEVICE_ID_KEY = "ccg-device-id";

const createDeviceId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

/**
 * Returns a stable device UUID.
 * Generates once, stores in localStorage, and reuses on subsequent calls.
 */
export const getDeviceId = (): string => {
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) {
    return existing;
  }

  const deviceId = createDeviceId();
  localStorage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
};

export const DEVICE_ID_STORAGE_KEY = DEVICE_ID_KEY;
