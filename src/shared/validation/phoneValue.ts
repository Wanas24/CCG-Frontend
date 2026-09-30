const dialCodeOnlyPattern = /^\+\d{1,4}$/;

export const isEmptyPhoneValue = (value: string) => {
  const normalized = value.replace(/[\s\-()]/g, "");
  return (
    normalized === "" ||
    normalized === "+" ||
    dialCodeOnlyPattern.test(normalized)
  );
};

export const normalizePhoneValue = (value: string) =>
  isEmptyPhoneValue(value) ? "" : value;
