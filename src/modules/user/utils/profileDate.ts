import dayjs from "dayjs";

export const toProfileFormDate = (value: string): string => {
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};

export const toProfileApiDate = (value: string): string => {
  return dayjs(value).startOf("day").toISOString();
};
