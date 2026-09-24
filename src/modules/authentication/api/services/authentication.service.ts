import type { TLoginPayload, TRegisterPayload } from "../../types/auth";
import { authEndpoints } from "../endPoints/authentication.endpoints";
import { callEndpoint } from "@/lib/api/callEndpoint";

export const authService = {
  login: (body: TLoginPayload) =>
    callEndpoint<void, TLoginPayload>(authEndpoints.login, { body }),
  register: (body: TRegisterPayload) =>
    callEndpoint<void, TRegisterPayload>(authEndpoints.register, { body }),
};
