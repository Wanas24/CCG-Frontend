import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const signupSchema = z
  .object({
    firstName: z.string().min(1, VALIDATION.required),
    lastName: z.string().min(1, VALIDATION.required),
    email: z
      .string()
      .min(1, VALIDATION.required)
      .email(VALIDATION.email),
    password: z
      .string()
      .min(1, VALIDATION.required)
      .min(8, VALIDATION.passwordMin),
    confirmPassword: z.string().min(1, VALIDATION.required),
    phoneNumber: z.string().min(1, VALIDATION.required),
    fullAddress: z.string().min(1, VALIDATION.required),
    extraPhone: z.string().min(1, VALIDATION.required),
    nationalId: z.string().min(1, VALIDATION.required),
    dateOfBirth: z.string().min(1, VALIDATION.required),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION.passwordMatch,
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
