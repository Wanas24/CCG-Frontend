import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const loginSchema = z.object({
  // email: z.email(VALIDATION.email),
  email: z.string().email(VALIDATION.email),
  password: z.string().min(1, VALIDATION.required),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
