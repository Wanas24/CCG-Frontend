import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const roleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, VALIDATION.required)
    .max(200, VALIDATION.maxLength200),
  description: z.string().trim().max(500, VALIDATION.maxLength500),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
