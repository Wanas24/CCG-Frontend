import { z } from "zod";
import { VALIDATION } from "@/shared/validation";
import { optionalEgyptMobileSchema } from "@/modules/authentication/schemas";

const isPastDateOnly = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const dateOfBirth = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    dateOfBirth.getFullYear() === year &&
    dateOfBirth.getMonth() === month - 1 &&
    dateOfBirth.getDate() === day &&
    dateOfBirth < today
  );
};

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, VALIDATION.required)
    .max(50, VALIDATION.maxLength50),
  lastName: z
    .string()
    .min(1, VALIDATION.required)
    .max(50, VALIDATION.maxLength50),
  extraPhone: optionalEgyptMobileSchema,
  nationalId: z
    .string()
    .min(1, VALIDATION.required)
    .length(14, VALIDATION.nationalIdLength),
  dateOfBirth: z
    .string()
    .min(1, VALIDATION.required)
    .refine(isPastDateOnly, VALIDATION.dateOfBirthPast),
  fullAddress: z.string().min(1, VALIDATION.required),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
