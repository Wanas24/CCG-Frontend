import { z } from "zod";

type Translate = (key: string) => string;

export const createSignupSchema = (t: Translate) =>
  z
    .object({
      fullName: z.string().min(1, t("validation.required")),
      email: z
        .string()
        .min(1, t("validation.required"))
        .email(t("validation.email")),
      password: z
        .string()
        .min(1, t("validation.required"))
        .min(8, t("validation.passwordMin")),
      confirmPassword: z.string().min(1, t("validation.required")),
      acceptTerms: z.boolean().refine((value) => value, {
        message: t("validation.required"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMatch"),
      path: ["confirmPassword"],
    });

export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;
