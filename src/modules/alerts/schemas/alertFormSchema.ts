import { z } from "zod";
import { VALIDATION } from "@/shared/validation";

export const alertFormSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(1, VALIDATION.required)
      .max(1000, VALIDATION.maxLength1000),
    triggerAt: z.string().trim().min(1, VALIDATION.required),
    audience: z.enum(["managers", "everyone", "people"]),
    receiverUserIds: z.array(z.string()),
  })
  .superRefine((values, context) => {
    const triggerMs = new Date(values.triggerAt).getTime();
    if (Number.isNaN(triggerMs)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["triggerAt"],
        message: "alerts.form.triggerInvalid",
      });
    }

    if (values.audience === "people" && values.receiverUserIds.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["receiverUserIds"],
        message: "alerts.form.peopleRequired",
      });
    }
  });

export type AlertFormValues = z.infer<typeof alertFormSchema>;
