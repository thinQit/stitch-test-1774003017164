export type ApiOptions = RequestInit & {
  baseUrl?: string;
};

const defaultBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function request<T>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const { baseUrl = defaultBaseUrl, headers, ...rest } = options;
  const response = await fetch(`${baseUrl}${url}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    cache: rest.cache ?? "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(url: string, options?: ApiOptions) =>
    request<T>(url, { ...options, method: "GET" }),
  post: <T, B = unknown>(url: string, body?: B, options?: ApiOptions) =>
    request<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T, B = unknown>(url: string, body?: B, options?: ApiOptions) =>
    request<T>(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T, B = unknown>(url: string, body?: B, options?: ApiOptions) =>
    request<T>(url, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(url: string, options?: ApiOptions) =>
    request<T>(url, { ...options, method: "DELETE" }),
};
