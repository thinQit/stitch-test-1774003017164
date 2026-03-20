export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

const parseJson = (text: string) => {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

const request = async <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    const text = await res.text();
    const json = parseJson(text) as { data?: T; error?: string; message?: string } | undefined;

    if (!res.ok) {
      return {
        error: json?.error || json?.message || res.statusText || 'Request failed',
        status: res.status
      };
    }

    return {
      data: (json?.data ?? json) as T | undefined,
      status: res.status
    };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : 'Network error',
      status: 500
    };
  }
};

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined
    }),
  put: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined
    }),
  delete: <T>(url: string) =>
    request<T>(url, {
      method: 'DELETE'
    })
};
