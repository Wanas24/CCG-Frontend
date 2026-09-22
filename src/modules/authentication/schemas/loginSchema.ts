import { z } from "zod";

type Translate = (key: string) => string;

export const createLoginSchema = (t: Translate) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation.required"))
      .email(t("validation.email")),
    password: z
      .string()
      .min(1, t("validation.required"))
      .min(8, t("validation.passwordMin")),
    rememberMe: z.boolean(),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
