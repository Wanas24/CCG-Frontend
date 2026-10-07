import { z } from "zod";
import { LAYOUT_LIMITS } from "./layoutLimits";

export const layoutIdentitySchema = z.object({
  code: z.string().trim().min(1).max(LAYOUT_LIMITS.code),
  name: z.string().trim().min(1).max(LAYOUT_LIMITS.name),
});

export type TLayoutIdentity = z.infer<typeof layoutIdentitySchema>;
