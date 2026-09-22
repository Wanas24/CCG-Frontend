import { z } from "zod";

type Translate = (key: string) => string;

export const createForgotPasswordSchema = (t: Translate) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation.required"))
      .email(t("validation.email")),
  });

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
