import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const companyDeleteConfirmSchema = z.object({
  password: z.string().min(1, VALIDATION.required),
});

export type CompanyDeleteConfirmValues = z.infer<
  typeof companyDeleteConfirmSchema
>;
