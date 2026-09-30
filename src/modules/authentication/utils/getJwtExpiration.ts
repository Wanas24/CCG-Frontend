import { jwtDecode } from "jwt-decode";

type AccessTokenPayload = {
  exp?: number;
};

export const getJwtExpirationMs = (token: string): number | null => {
  try {
    const payload = jwtDecode<AccessTokenPayload>(token);

    if (typeof payload.exp !== "number") {
      return null;
    }

    return payload.exp * 1000;
  } catch {
    return null;
  }
};

const DEFAULT_SKEW_MS = 60_000;

export const isAccessTokenExpired = (
  token: string,
  skewMs = DEFAULT_SKEW_MS,
): boolean => {
  const expMs = getJwtExpirationMs(token);
  if (expMs === null) {
    return true;
  }

  return Date.now() >= expMs - skewMs;
};
