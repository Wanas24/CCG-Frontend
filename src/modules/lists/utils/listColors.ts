export const hueFromString = (value: string | number) => {
  let hash = 0;
  for (const char of String(value)) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }
  return hash;
};

const TYPE_HUES: Record<number, number> = {
  1: 210,
  2: 36,
  3: 168,
  4: 275,
  5: 14,
};

export const typeHue = (type: number) =>
  TYPE_HUES[type] ?? hueFromString(type);
