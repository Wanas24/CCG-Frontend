import { z } from "zod";
import { VALIDATION } from "@/shared/validation";
import {
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from "../constants/projectList";

const optionalText = z.string().trim().max(500, VALIDATION.maxLength500);

export const projectFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, VALIDATION.required)
    .max(200, VALIDATION.maxLength200),
  number: optionalText,
  officialName: optionalText,
  clientId: z.number().positive(VALIDATION.required),
  projectType: z
    .number()
    .refine(
      (value) => (PROJECT_TYPE_OPTIONS as readonly number[]).includes(value),
      VALIDATION.required,
    ),
  status: z
    .number()
    .refine(
      (value) => (PROJECT_STATUS_OPTIONS as readonly number[]).includes(value),
      VALIDATION.required,
    ),
  notes: z.string().trim().max(1000, VALIDATION.maxLength1000),
  taxIncluded: z.boolean(),
  hasDemolisionLicence: z.boolean(),
  hasCivilDefenseLicence: z.boolean(),
  isActive: z.boolean(),
  country: optionalText,
  city: optionalText,
  district: optionalText,
  street: optionalText,
  buildingNumber: optionalText,
  postalCode: optionalText,
  latitude: z.string().trim(),
  longitude: z.string().trim(),
  landmark: optionalText,
  locationNotes: optionalText,
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
