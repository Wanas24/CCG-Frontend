import { z } from "zod";
import { requiredEgyptMobileSchema } from "@/modules/authentication/schemas";

export const changePhoneSchema = z.object({
  phoneNumber: requiredEgyptMobileSchema,
});

export type ChangePhoneFormValues = z.infer<typeof changePhoneSchema>;
