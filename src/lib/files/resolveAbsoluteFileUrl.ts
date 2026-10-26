const apiBaseUrl = () =>
  String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export const resolveAbsoluteFileUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("blob:")) return trimmed;

  const base = apiBaseUrl();
  if (!base) return trimmed;
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  return `${base}/${trimmed}`;
};
