import { z } from "zod";
import { VALIDATION } from "@/shared/validation";
import {
  isEmptyPhoneValue,
  normalizePhoneValue,
} from "@/shared/validation/phoneValue";

export const EGYPT_MOBILE_E164 = /^\+20(10|11|12|15)\d{8}$/;

export { isEmptyPhoneValue, normalizePhoneValue };

export const normalizeOptionalPhone = normalizePhoneValue;

export const requiredEgyptMobileSchema = z
  .string()
  .min(1, VALIDATION.required)
  .regex(EGYPT_MOBILE_E164, VALIDATION.phoneInvalid);

export const optionalEgyptMobileSchema = z
  .string()
  .refine(
    (value) => value === "" || EGYPT_MOBILE_E164.test(value),
    VALIDATION.phoneInvalid,
  );
