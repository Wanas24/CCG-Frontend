import { z } from "zod";

type Translate = (key: string) => string;

export const createResetPasswordSchema = (t: Translate) =>
  z
    .object({
      password: z
        .string()
        .min(1, t("validation.required"))
        .min(8, t("validation.passwordMin")),
      confirmPassword: z.string().min(1, t("validation.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMatch"),
      path: ["confirmPassword"],
    });

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
