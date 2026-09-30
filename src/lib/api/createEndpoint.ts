type AuthType = "none" | "required";

export interface TCreateEndpointProps {
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  path: string;
  auth?: AuthType;
  permissions?: string[];
  skipToast?: boolean;
}

export const createEndpoint = (
  options: TCreateEndpointProps,
): TCreateEndpointProps => {
  return {
    auth: "required",
    permissions: [],
    skipToast: false,
    ...options,
  } as const;
};
