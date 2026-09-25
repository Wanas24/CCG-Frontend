import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION.required)
    .email(VALIDATION.email),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
