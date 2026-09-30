import { z } from "zod";

export const aiSubscriptionUpdateSchema = z
  .object({
    isSubscribed: z.boolean(),
    subscribedFromUtc: z.string().nullable().optional(),
    subscribedToUtc: z.string().nullable().optional(),
    hasUnlimitedUsage: z.boolean(),
    monthlyTokenLimit: z
      .number()
      .int("ai.subscriptions.validation.integer")
      .nonnegative("ai.subscriptions.validation.nonNegative"),
    monthlyMessageLimit: z
      .number()
      .int("ai.subscriptions.validation.integer")
      .nonnegative("ai.subscriptions.validation.nonNegative"),
    historyMessageCount: z
      .number()
      .int("ai.subscriptions.validation.integer")
      .min(0, "ai.subscriptions.validation.historyRange")
      .max(100, "ai.subscriptions.validation.historyRange"),
  })
  .superRefine((values, ctx) => {
    if (
      values.subscribedFromUtc &&
      values.subscribedToUtc &&
      values.subscribedFromUtc > values.subscribedToUtc
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["subscribedToUtc"],
        message: "ai.subscriptions.validation.dateRange",
      });
    }
  });

export type AiSubscriptionUpdateFormValues = z.infer<
  typeof aiSubscriptionUpdateSchema
>;
