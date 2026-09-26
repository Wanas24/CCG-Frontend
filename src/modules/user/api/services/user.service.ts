import { callEndpoint } from "@/lib/api/callEndpoint";
import type { TGetUserResponse } from "../../types";
import { userEndpoints } from "../endPoints/user.endpoints";

export const userService = {
  getUser: () => callEndpoint<TGetUserResponse>(userEndpoints.getUser),
};
