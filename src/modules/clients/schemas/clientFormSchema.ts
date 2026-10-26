import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

const optionalText = z.string();

export const clientFormSchema = z.object({
  name: z.string().trim().min(1, VALIDATION.required),
  notes: optionalText,
  email: z
    .string()
    .trim()
    .refine(
      (value) =>
        value.length === 0 || z.string().email().safeParse(value).success,
      VALIDATION.email,
    ),
  phone: optionalText,
  address: optionalText,
  city: optionalText,
  country: optionalText,
  contactPerson: optionalText,
  taxNumber: optionalText,
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const CLIENT_FORM_FIELD_NAMES = [
  "name",
  "notes",
  "email",
  "phone",
  "address",
  "city",
  "country",
  "contactPerson",
  "taxNumber",
] as const satisfies ReadonlyArray<keyof ClientFormValues>;
