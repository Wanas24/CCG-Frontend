import type { TFunction } from "i18next";

export const layoutText = (
  t: TFunction,
  key: string,
  options?: Record<string, unknown>,
) =>
  (
    t as (nextKey: string, nextOptions?: Record<string, unknown>) => string
  )(key, options);
