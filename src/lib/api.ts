export type ApiError = {
  status: number;
  message: string;
};

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || '';
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = (await response.json()) as { message?: string };
      if (data?.message) message = data.message;
    } catch {
      // ignore JSON parse errors
    }
    const error: ApiError = { status: response.status, message };
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: async <T>(path: string, options: ApiFetchOptions = {}) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),
  post: async <T>(path: string, body?: unknown, options: ApiFetchOptions = {}) =>
    apiFetch<T>(path, { ...options, method: 'POST', body }),
};
