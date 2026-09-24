type AuthType = "none" | "required";

export interface TCreateEndpointProps {
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  path: string;
  auth?: AuthType;
  permissions?: string[];
}

export const createEndpoint = (
  options: TCreateEndpointProps,
): TCreateEndpointProps => {
  return {
    auth: "required",
    permissions: [],
    ...options,
  } as const;
};
