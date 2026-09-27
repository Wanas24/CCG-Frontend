import { AUTH_ROUTES } from "./paths";

const PUBLIC_AUTH_PATHS = new Set<string>(Object.values(AUTH_ROUTES));

export const isPublicAuthPath = (pathname: string): boolean => {
  return PUBLIC_AUTH_PATHS.has(pathname);
};
