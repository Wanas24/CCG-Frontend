import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const signupSchema = z
  .object({
    fullName: z.string().min(1, VALIDATION.required),
    email: z
      .string()
      .min(1, VALIDATION.required)
      .email(VALIDATION.email),
    password: z
      .string()
      .min(1, VALIDATION.required)
      .min(8, VALIDATION.passwordMin),
    confirmPassword: z.string().min(1, VALIDATION.required),
    acceptTerms: z.boolean().refine((value) => value, {
      message: VALIDATION.required,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION.passwordMatch,
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
