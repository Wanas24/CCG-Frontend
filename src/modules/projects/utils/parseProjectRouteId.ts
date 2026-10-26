export const parseProjectRouteId = (value: string | undefined) => {
  if (!value?.trim()) return null;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
};
