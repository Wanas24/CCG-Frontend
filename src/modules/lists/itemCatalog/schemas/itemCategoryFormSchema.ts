import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const itemCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, VALIDATION.required)
    .max(200, VALIDATION.maxLength200),
  type: z.number().positive(VALIDATION.required),
  unitId: z.number().positive(VALIDATION.required),
  description: z.string().trim().max(1000, VALIDATION.maxLength1000),
  notes: z.string().trim().max(1000, VALIDATION.maxLength1000),
});

export type ItemCategoryFormValues = z.infer<typeof itemCategoryFormSchema>;
