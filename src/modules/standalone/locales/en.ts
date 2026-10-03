const notFound = {
  title: "Page not found",
  description:
    "The page you are looking for does not exist or may have been moved.",
  goHome: "Back to Home",
  goLogin: "Go to Login",
} as const;

export const home = {
  navLabel: "Home",
} as const;

export const settings = {
  navLabel: "Settings",
} as const;

export default notFound;
