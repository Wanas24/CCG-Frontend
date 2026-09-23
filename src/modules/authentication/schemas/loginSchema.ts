import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION.required)
    .email(VALIDATION.email),
  password: z
    .string()
    .min(1, VALIDATION.required)
    .min(8, VALIDATION.passwordMin),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
