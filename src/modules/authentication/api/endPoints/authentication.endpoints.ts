import { createEndpoint } from "@/lib/api/createEndpoint";

export const authEndpoints = {
  login: createEndpoint({
    method: "POST",
    path: `/auth/login`,
    auth: "none",
  }),
  register: createEndpoint({
    method: "POST",
    path: `/auth/register`,
    auth: "none",
  }),
  refreshToken: createEndpoint({
    method: "GET",
    path: `/auth/refreshToken`,
    auth: "none",
  }),
  revokeToken: createEndpoint({
    method: "POST",
    path: `/auth/revokeToken`,
    auth: "none",
  }),
  forgotPassword: createEndpoint({
    method: "POST",
    path: `/auth/forgot-password`,
    auth: "none",
  }),
  resetPassword: createEndpoint({
    method: "POST",
    path: `/auth/reset-password`,
    auth: "none",
  }),
  sendEmailConfirmation: createEndpoint({
    method: "POST",
    path: `/auth/send-email-confirmation`,
    auth: "none",
  }),
  confirmEmail: createEndpoint({
    method: "GET",
    path: `/auth/confirm-email`,
    auth: "none",
  }),
  verifyPhone: createEndpoint({
    method: "POST",
    path: `/auth/verify-phone`,
    auth: "required",
  }),
  confirmationStatus: createEndpoint({
    method: "GET",
    path: `/auth/confirmation-status`,
    auth: "required",
  }),
};
