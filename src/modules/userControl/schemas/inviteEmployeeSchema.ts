import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const inviteEmployeeSchema = z.object({
  employeeEmail: z
    .string()
    .trim()
    .min(1, VALIDATION.required)
    .email(VALIDATION.email),
});

export type InviteEmployeeValues = z.infer<typeof inviteEmployeeSchema>;
