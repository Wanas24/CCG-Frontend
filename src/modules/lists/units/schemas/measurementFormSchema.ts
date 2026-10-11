import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const measurementFormSchema = z.object({
  unit: z
    .string()
    .trim()
    .min(1, VALIDATION.required)
    .max(50, VALIDATION.maxLength50),
  details: z.string().trim().max(500, VALIDATION.maxLength500),
});

export type MeasurementFormValues = z.infer<typeof measurementFormSchema>;
