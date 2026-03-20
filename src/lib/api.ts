type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get<T>(url: string) {
    return request<T>(url, { method: 'GET' });
  },
  post<T>(url: string, body?: JsonValue) {
    return request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  },
  put<T>(url: string, body?: JsonValue) {
    return request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  },
  patch<T>(url: string, body?: JsonValue) {
    return request<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    });
  },
  delete<T>(url: string) {
    return request<T>(url, { method: 'DELETE' });
  }
};
