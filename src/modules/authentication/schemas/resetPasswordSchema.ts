import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

const passwordComplexity = (value: string) =>
  /[a-z]/.test(value) &&
  /[A-Z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9]/.test(value);

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, VALIDATION.required)
      .min(8, VALIDATION.passwordMin)
      .refine(passwordComplexity, VALIDATION.passwordComplexity),
    confirmPassword: z.string().min(1, VALIDATION.required),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION.passwordMatch,
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
