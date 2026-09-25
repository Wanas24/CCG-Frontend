import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

const EGYPT_MOBILE_E164 = /^\+20(10|11|12|15)\d{8}$/;

const passwordComplexity = (value: string) =>
  /[a-z]/.test(value) &&
  /[A-Z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9]/.test(value);

const isPastDateOnly = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const dateOfBirth = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    dateOfBirth.getFullYear() === year &&
    dateOfBirth.getMonth() === month - 1 &&
    dateOfBirth.getDate() === day &&
    dateOfBirth < today
  );
};

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, VALIDATION.required)
      .max(50, VALIDATION.maxLength50),
    lastName: z
      .string()
      .min(1, VALIDATION.required)
      .max(50, VALIDATION.maxLength50),
    email: z
      .string()
      .min(1, VALIDATION.required)
      .email(VALIDATION.email),
    password: z
      .string()
      .min(1, VALIDATION.required)
      .min(8, VALIDATION.passwordMin)
      .refine(passwordComplexity, VALIDATION.passwordComplexity),
    confirmPassword: z.string().min(1, VALIDATION.required),
    phoneNumber: z
      .string()
      .min(1, VALIDATION.required)
      .regex(EGYPT_MOBILE_E164, VALIDATION.phoneInvalid),
    fullAddress: z.string().min(1, VALIDATION.required),
    extraPhone: z
      .string()
      .refine(
        (value) => value === "" || EGYPT_MOBILE_E164.test(value),
        VALIDATION.phoneInvalid,
      ),
    nationalId: z
      .string()
      .min(1, VALIDATION.required)
      .length(14, VALIDATION.nationalIdLength),
    dateOfBirth: z
      .string()
      .min(1, VALIDATION.required)
      .refine(isPastDateOnly, VALIDATION.dateOfBirthPast),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION.passwordMatch,
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
