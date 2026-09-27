import { AUTH_ROUTES } from "./paths";

/** Guest-facing auth URLs — exclude verify-account (requires a session). */
const PUBLIC_AUTH_PATHS = new Set<string>([
  AUTH_ROUTES.login,
  AUTH_ROUTES.signup,
  AUTH_ROUTES.forgotPassword,
  AUTH_ROUTES.resetPassword,
  AUTH_ROUTES.confirmEmail,
]);

export const isPublicAuthPath = (pathname: string): boolean => {
  return PUBLIC_AUTH_PATHS.has(pathname);
};
