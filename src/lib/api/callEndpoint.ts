// callEndpoint.ts
import apiClient from "./apiClient";
import type { TCreateEndpointProps } from "./createEndpoint";

const buildPath = (path: string, params?: Record<string, string | number>) => {
  if (!params) return path;
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
    path,
  );
};

interface RequestOptions<TBody = unknown> {
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number>;
  body?: TBody;
}

export const callEndpoint = async <TResponse, TBody = unknown>(
  endpoint: TCreateEndpointProps,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> => {
  const url = buildPath(endpoint.path, options.pathParams);

  const { data } = await apiClient.request<TResponse>({
    url,
    method: endpoint.method,
    params: options.queryParams,
    data: options.body,
  });

  return data;
};
