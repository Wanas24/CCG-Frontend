import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const companyFormSchema = z.object({
  name: z.string().min(1, VALIDATION.required),
  description: z.string(),
  address: z.string().min(1, VALIDATION.required),
  timeZoneId: z.string().min(1, VALIDATION.required),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
